import 'reflect-metadata';
import { dbService, eventService, metadataService, operationWs, queue } from './indexerServices';
import {
    createChainSyncClient,
    createInteractionContext,
    createStateQueryClient,
    InteractionContext
} from '@cardano-ogmios/client';
import { Block, TipOrOrigin, Point, PointOrOrigin, BlockAlonzo, BlockBabbage } from '@cardano-ogmios/schema';
import { logError, logInfo } from './logger';
import { BaseIndexer } from './indexers/BaseIndexer';
import { ChainSyncClient } from '@cardano-ogmios/client/dist/ChainSync';
import { AmmDexTransactionIndexer } from './indexers/AmmDexTransactionIndexer';
import { BaseCacheStorage } from './storage/BaseCacheStorage';
import { MinswapAnalyzer } from './dex/MinswapAnalyzer';
import { SundaeSwapAnalyzer } from './dex/SundaeSwapAnalyzer';
import { WingRidersAnalyzer } from './dex/WingRidersAnalyzer';
import { SpectrumAnalyzer } from './dex/SpectrumAnalyzer';
import CONFIG from './config';
import { SyncIndexer } from './indexers/SyncIndexer';
import { EntityManager } from 'typeorm';
import { Sync } from './db/entities/Sync';
import { StateQueryClient } from '@cardano-ogmios/client/dist/StateQuery';
import { FIRST_SYNC_BLOCK_HASH, FIRST_SYNC_SLOT } from './constants';
import { TeddySwapAnalyzer } from './dex/TeddySwapAnalyzer';
import { OrderBookDexTransactionIndexer } from './indexers/OrderBookDexTransactionIndexer';
import { GeniusYieldAnalyzer } from './dex/GeniusYieldAnalyzer';
import { BaseEventListener } from './listeners/BaseEventListener';

export class IndexerApplication {

    /**
     * Storage to use for application.
     */
    private readonly _cache: BaseCacheStorage;

    private latestSlot: number = 0;
    private chainSyncClient: ChainSyncClient | undefined = undefined;
    private stateQueryClient: StateQueryClient | undefined = undefined;

    private readonly _eventListeners: BaseEventListener[] = [];

    /**
     * Indexers to make aware of new blocks & rollbacks.
     */
    private _indexers: BaseIndexer[] = [
        new SyncIndexer(),
        new AmmDexTransactionIndexer([
            new MinswapAnalyzer(this),
            new SundaeSwapAnalyzer(this),
            new WingRidersAnalyzer(this),
            new SpectrumAnalyzer(this),
            new TeddySwapAnalyzer(this),
            // new MuesliSwapAnalyzer(this),
        ]),
        new OrderBookDexTransactionIndexer([
            new GeniusYieldAnalyzer(this),
        ]),
    ];

    /**
     * IndexerApplication constructor.
     */
    constructor(
        cache: BaseCacheStorage,
        eventListeners: BaseEventListener[] = [],
    ) {
        this._cache = cache;
        this._eventListeners = eventListeners;
    }

    /**
     * Retrieve instance of storage.
     */
    get cache(): BaseCacheStorage {
        return this._cache;
    }

    /**
     * Start application.
     */
    public async start(): Promise<any> {
        return Promise.all([
            this._cache.boot(),
            this.bootServices(),
        ]).then(() => this.bootOgmios());
    }

    /**
     * Boot all necessary services for application.
     */
    private async bootServices(): Promise<any> {
        logInfo('Booting services...');

        return Promise.all([
            dbService.boot(this),
            eventService.boot(this, this._eventListeners),
            operationWs.boot(),
            metadataService.boot(),
            queue.boot(),
        ]).then(() => {
            logInfo('Services booted');
        }).catch((reason) => {
            logError(reason);
            process.exit(0);
        });
    }

    /**
     * Boot Ogmios connection.
     */
    private async bootOgmios(): Promise<any> {
        logInfo('Booting Ogmios connection...');

        const context: InteractionContext = await createInteractionContext(
            err => logError(err.message),
            () => {
                logError('Ogmios connection closed. Restarting...');

                this.start();
            },
            {
                connection: {
                    host: CONFIG.OGMIOS_HOST,
                    port: CONFIG.OGMIOS_PORT,
                    tls: CONFIG.OGMIOS_TLS,
                },
            }
        ).then((context: InteractionContext) => {
            logInfo('Ogmios connected');

            return context;
        }).catch((reason) => {
            logError(reason);
            process.exit(0);
        });

        this.chainSyncClient = await createChainSyncClient(
            context,
            {
                rollForward: this.rollForward.bind(this),
                rollBackward: this.rollBackward.bind(this),
            },
            {
                sequential: true,
            }
        );
        this.stateQueryClient = await createStateQueryClient(context);

        const lastSync: Sync | undefined = await dbService.transaction(async (manager: EntityManager): Promise<Sync | undefined> => {
            return await manager.findOneBy(Sync, {
                id: 1,
            }) ?? undefined;
        });

        /**
         * SundaeSwap  - 50367177, 91c16d5ae92f2eb791c3c2da9b38126b98623b07f611d4a4b913f0ab2af721d2
         * Minswap     - 56553560, f6579343856a49cd76f713c2ac9ded86690bec029878ca67b87e9caa80d4de18
         * WingRiders  - 57274883, 2793f430b0ae3fa2a64a3d6aa7f3aad87e0af34239a52f36b26353756a423b34
         * MuesliSwap  - 65094197, ce75a42b708f47c1ea4ddeb204907e8f3569559c1bb09a05c7b2f4a0c3f84837
         * Spectrum    - 98301694, d0d2abcaf741be13d353ac80b0f9001d7b323a2b5827ff2dce6480bf032dd3db
         * TeddySwap   - 109078697, 8494922f6266885a671408055d7123e1c7bdf78b9cd86720680c55c1f94e839e
         * GeniusYield - 110315300, d7281a52d68eef89a7472860fdece323ecc39d3054cdd1fa0825afe56b942a86
         */
        return lastSync
            ? this.chainSyncClient.startSync([{ slot: lastSync.slot, hash: lastSync.blockHash }])
            : this.chainSyncClient.startSync([{ slot: FIRST_SYNC_SLOT, hash: FIRST_SYNC_BLOCK_HASH }]);
    }

    /**
     * Handler for Ogmios new block. Send to all indexers.
     * @param update - New block update.
     * @param requestNext - Callback to request next block.
     */
    private async rollForward(update: { block: Block, tip: TipOrOrigin }, requestNext: () => void): Promise<void> {
        let block: BlockAlonzo | BlockBabbage | undefined = undefined;

        if ('babbage' in update.block) {
            block = update.block.babbage;
        } else if ('alonzo' in update.block) {
            block = update.block.alonzo;
        }

        if (block) {
            logInfo(`=== Analyzing block at slot ${block.header.slot} ===`);

            this.latestSlot = block.header.slot;

            await Promise.all(
                this._indexers.map((indexer: BaseIndexer) => indexer.onRollForward(block as BlockAlonzo | BlockBabbage)),
            );

            if (queue.size > 0) {
                logInfo(`[Queue] Running ${queue.size} jobs`);
                await queue.settle();
                logInfo('[Queue] Finished');
            }

            logInfo(`=== Finished with block at slot ${block.header.slot} ===`);
        }

        requestNext();
    }

    /**
     * Handler for Ogmios rollback. Send to all indexers.
     * @param update - Point in which to revert to.
     * @param requestNext - Callback to request next block.
     */
    private async rollBackward(update: { point: PointOrOrigin }, requestNext: () => void): Promise<void> {
        if (typeof update.point === 'object' && 'slot' in update.point) {
            logInfo(`Rollback occurred to slot ${update.point.slot}`);

            const point: Point = update.point;

            await Promise.all(
                this._indexers.map((indexer: BaseIndexer) => indexer.onRollBackward(point.hash, point.slot)),
            );
        }

        requestNext();
    }

}
