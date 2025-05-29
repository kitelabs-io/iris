import { BaseCronjob } from './BaseCronjob';
import { logInfo, logError } from '../logger';
import { dbService } from '../indexerServices';
import { EntityManager } from 'typeorm';

export class CleanupCronjob extends BaseCronjob {
  constructor() {
    super('cleanup-old-data', '0 2 * * *'); // Daily at 2 AM
  }

  async execute(): Promise<void> {
    try {
      logInfo('Starting cleanup cronjob...');

      await dbService.transaction(async (manager: EntityManager) => {
        // Clean up old transaction records (older than 90 days)
        const oldTransactionsResult = await manager.query(`
          DELETE FROM Transaction 
          WHERE created_at < NOW() - INTERVAL '90 days'
        `);
        logInfo(`Cleaned up ${oldTransactionsResult.affectedRows || 0} old transactions`);

        // Clean up old liquidity pool state records (older than 30 days)
        const oldPoolStatesResult = await manager.query(`
          DELETE FROM LiquidityPoolState 
          WHERE created_at < NOW() - INTERVAL '30 days'
        `);
        logInfo(`Cleaned up ${oldPoolStatesResult.affectedRows || 0} old pool states`);

        // Clean up old asset price records (older than 7 days, keep only latest daily records)
        const oldPricesResult = await manager.query(`
          DELETE ap1 FROM AssetPrice ap1
          INNER JOIN AssetPrice ap2 
          WHERE ap1.asset_id = ap2.asset_id
            AND ap1.created_at < ap2.created_at
            AND ap1.created_at < NOW() - INTERVAL '7 days'
            AND DATE(ap1.created_at) = DATE(ap2.created_at)
        `);
        logInfo(`Cleaned up ${oldPricesResult.affectedRows || 0} old asset prices`);

        // Clean up old logs (older than 14 days)
        const oldLogsResult = await manager.query(`
          DELETE FROM Log 
          WHERE created_at < NOW() - INTERVAL '14 days'
        `);
        logInfo(`Cleaned up ${oldLogsResult.affectedRows || 0} old logs`);

        // Optimize tables after cleanup
        await manager.query('OPTIMIZE TABLE Transaction');
        await manager.query('OPTIMIZE TABLE LiquidityPoolState');
        await manager.query('OPTIMIZE TABLE AssetPrice');
        await manager.query('OPTIMIZE TABLE Log');

        logInfo('Database tables optimized');
      });

      logInfo('Cleanup cronjob completed successfully');
    } catch (error) {
      logError(`Cleanup cronjob failed: ${error}`);
      throw error;
    }
  }
}