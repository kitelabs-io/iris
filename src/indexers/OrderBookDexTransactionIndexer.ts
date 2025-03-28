import { BaseIndexer } from './BaseIndexer';
import {
  Slot,
  BlockPraos,
  Transaction as OgmiosTransaction,
} from '@cardano-ogmios/schema';
import { OrderBookDexOperation, Transaction } from '../types';
import { dbService } from '../indexerServices';
import { EntityManager, MoreThan } from 'typeorm';
import { logInfo } from '../logger';
import { formatTransaction } from '../utils';
import { OrderBookOrder } from '../db/entities/OrderBookOrder';
import { BaseOrderBookDexAnalyzer } from '../dex/BaseOrderBookDexAnalyzer';
import { OrderBookMatch } from '../db/entities/OrderBookMatch';
import { OrderBook } from '../db/entities/OrderBook';
import { OrderBookOperationHandler } from '../handlers/OrderBookOperationHandler';

export class OrderBookDexTransactionIndexer extends BaseIndexer {
  private _analyzers: BaseOrderBookDexAnalyzer[];
  private _handler: OrderBookOperationHandler;

  constructor(analyzers: BaseOrderBookDexAnalyzer[]) {
    super();

    this._analyzers = analyzers;
    this._handler = new OrderBookOperationHandler();
  }

  async onRollForward(block: BlockPraos): Promise<any> {
    const operationPromises: Promise<OrderBookDexOperation[]>[] = (
      block.transactions ?? []
    )
      .map((transaction: OgmiosTransaction) => {
        return this._analyzers.map((analyzer: BaseOrderBookDexAnalyzer) => {
          const tx: Transaction = formatTransaction(block, transaction);

          if (analyzer.startSlot > tx.blockSlot) return [];

          return analyzer.analyzeTransaction(tx);
        });
      })
      .flat(2);

    return await Promise.all(operationPromises).then(
      async (operationsUnSorted: OrderBookDexOperation[][]) => {
        const operations: OrderBookDexOperation[] = operationsUnSorted.flat();

        const sortedOperations: OrderBookDexOperation[] = operations
          .sort((a: OrderBookDexOperation, b: OrderBookDexOperation) => {
            if (a instanceof OrderBookOrder) {
              return -1;
            }
            if (b instanceof OrderBookOrder) {
              return 1;
            }
            return 0;
          })
          .sort((a: OrderBookDexOperation, b: OrderBookDexOperation) => {
            const inMatch = (orderIdentifier: string): boolean => {
              return operations.some((operation: OrderBookDexOperation) => {
                if (!(operation instanceof OrderBookOrder)) return false;

                return operation.identifier === orderIdentifier;
              });
            };

            if (
              a instanceof OrderBookMatch &&
              a.referenceOrder &&
              inMatch(a.referenceOrder.identifier)
            ) {
              return -1;
            }
            if (
              b instanceof OrderBookMatch &&
              b.referenceOrder &&
              inMatch(b.referenceOrder.identifier)
            ) {
              return 1;
            }
            return 0;
          });

        for (const operation of sortedOperations) {
          await this._handler.handle(operation);
        }
      }
    );
  }

  async onRollBackward(blockHash: string, slot: Slot): Promise<any> {
    return await dbService.transaction(async (manager: EntityManager) => {
      const whereSlotClause = {
        slot: MoreThan(slot),
      };

      return Promise.all([
        manager.delete(OrderBookOrder, whereSlotClause),
        manager.delete(OrderBookMatch, whereSlotClause),
        manager.delete(OrderBook, {
          createdSlot: MoreThan(slot),
        }),
      ]).then(() => {
        logInfo('Removed Order Book entities');
      });
    });
  }
}
