import {
  BlockPraos,
  Transaction as OgmiosTransaction,
  Slot,
} from '@cardano-ogmios/schema';
import { slotToUnixTime } from '@lucid-evolution/lucid';
import { BaseAmmDexAnalyzer } from '../dex/BaseAmmDexAnalyzer';
import { AmmOperationHandler } from '../handlers/AmmOperationHandler';
import { dbService } from '../indexerServices';
import { logInfo } from '../logger';
import { AmmDexOperation, Transaction } from '../types';
import { formatTransaction } from '../utils';
import { BaseIndexer } from './BaseIndexer';

export class AmmDexTransactionIndexer extends BaseIndexer {
  private _analyzers: BaseAmmDexAnalyzer[];
  private _handler: AmmOperationHandler;

  constructor(analyzers: BaseAmmDexAnalyzer[]) {
    super();

    this._analyzers = analyzers;
    this._handler = new AmmOperationHandler();
  }

  async onRollForward(block: BlockPraos): Promise<any> {
    const operationPromises: Promise<AmmDexOperation[]>[] = (
      block.transactions ?? []
    )
      .map((transaction: OgmiosTransaction) => {
        return this._analyzers.map((analyzer: BaseAmmDexAnalyzer) => {
          const tx: Transaction = formatTransaction(block, transaction);

          if (analyzer.startSlot > tx.blockSlot) return [];

          return analyzer.analyzeTransaction(tx);
        });
      })
      .flat(2);

    return await Promise.all(operationPromises).then(
      async (operationsUnSorted: AmmDexOperation[][]) => {
        const operations: AmmDexOperation[] = operationsUnSorted.flat();
        // Synchronize updates. 'forEach' is not sequential
        for (const operation of operations) {
          await this._handler.handle(operation);
        }
      }
    );
  }

  async onRollBackward(blockHash: string, slot: Slot): Promise<any> {
    // Raw delete with for better performance
    await dbService.dbSource.query(
      'DELETE FROM operation_statuses WHERE slot > ?',
      [slot]
    );
    await dbService.dbSource.query(
      'DELETE FROM liquidity_pool_states WHERE slot > ?',
      [slot]
    );
    await dbService.dbSource.query(
      'DELETE FROM liquidity_pool_deposits WHERE slot > ?',
      [slot]
    );
    await dbService.dbSource.query(
      'DELETE FROM liquidity_pool_withdraws WHERE slot > ?',
      [slot]
    );
    await dbService.dbSource.query(
      'DELETE FROM liquidity_pool_swaps WHERE slot > ?',
      [slot]
    );
    await dbService.dbSource.query(
      'DELETE FROM liquidity_pool_zaps WHERE slot > ?',
      [slot]
    );
    await dbService.dbSource.query(
      'DELETE FROM liquidity_pools WHERE createdSlot > ?',
      [slot]
    );
    await dbService.dbSource.query(
      'DELETE FROM liquidity_pool_ticks WHERE time > ?',
      [slotToUnixTime('Mainnet', slot) / 1000]
    );

    logInfo('Removed AMM entities');
  }
}
