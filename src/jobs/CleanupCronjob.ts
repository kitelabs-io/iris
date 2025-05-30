import { EntityManager } from 'typeorm';
import { dbService } from '../indexerServices';
import { logError, logInfo } from '../logger';
import { BaseCronjob } from './BaseCronjob';

export class CleanupCronjob extends BaseCronjob {
  constructor() {
    super('cleanup-stale-liquidity-pool-states', '0 2 * * *'); // Daily at 2 AM
  }

  async execute(): Promise<void> {
    try {
      logInfo('Starting cleanup cronjob...');

      await dbService.transaction(async (manager: EntityManager) => {
        const oldTransactionsResult = await manager.query(`
          DELETE lps
          FROM liquidity_pool_states lps
          LEFT JOIN liquidity_pools lp ON lps.id = lp.latestStateId
          WHERE lp.id IS NULL;
        `);
        logInfo(
          `Cleaned up ${oldTransactionsResult.affectedRows || 0} stale liquidity pool states`
        );
      });

      logInfo('Cleanup cronjob completed successfully');
    } catch (error) {
      logError(`Cleanup cronjob failed: ${error}`);
      throw error;
    }
  }
}
