import {
  BlockPraos,
  Transaction as OgmiosTransaction,
  Slot,
} from '@cardano-ogmios/schema';
import { BaseHybridDexAnalyzer } from '../dex/BaseHybridDexAnalyzer';
import { HybridOperationHandler } from '../handlers/HybridOperationHandler';
import { HybridOperation, Transaction } from '../types';
import { formatTransaction } from '../utils';
import { BaseIndexer } from './BaseIndexer';

export class HybridDexTransactionIndexer extends BaseIndexer {
  private _analyzers: BaseHybridDexAnalyzer[];
  private _handler: HybridOperationHandler;

  constructor(analyzers: BaseHybridDexAnalyzer[]) {
    super();

    this._analyzers = analyzers;
    this._handler = new HybridOperationHandler();
  }

  async onRollForward(block: BlockPraos): Promise<any> {
    const operationPromises: Promise<HybridOperation[]>[] = (
      block.transactions ?? []
    )
      .map((transaction: OgmiosTransaction) => {
        return this._analyzers.map((analyzer: BaseHybridDexAnalyzer) => {
          const tx: Transaction = formatTransaction(block, transaction);

          if (analyzer.startSlot > tx.blockSlot) return [];

          return analyzer.analyzeTransaction(tx);
        });
      })
      .flat(2);

    return await Promise.all(operationPromises).then(
      async (operationsUnSorted: HybridOperation[][]) => {
        const operations: HybridOperation[] = operationsUnSorted.flat();
        // Synchronize updates. 'forEach' is not sequential
        for (const operation of operations) {
          await this._handler.handle(operation);
        }
      }
    );
  }

  async onRollBackward(blockHash: string, slot: Slot): Promise<any> {
    return Promise.resolve();
  }
}
