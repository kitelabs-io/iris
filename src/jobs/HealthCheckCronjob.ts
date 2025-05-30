import { EntityManager } from 'typeorm';
import CONFIG from '../config';
import { dbService } from '../indexerServices';
import { logError, logInfo, logWarning } from '../logger';
import { BaseCronjob } from './BaseCronjob';

export class HealthCheckCronjob extends BaseCronjob {
  constructor() {
    super('health-check', '*/30 * * * * *');
  }

  async execute(): Promise<void> {
    try {
      logInfo('Starting health check cronjob...');

      await this.checkDatabaseHealth();
      await this.checkSyncStatus();
      this.checkMemoryUsage();

      logInfo('Health check cronjob completed successfully');
    } catch (error) {
      logError(`Health check cronjob failed: ${error}`);
      throw error;
    }
  }

  private async checkDatabaseHealth(): Promise<void> {
    try {
      await dbService.transaction(async (manager: EntityManager) => {
        const result = await manager.query('SELECT 1 as health');
        if (!result || result.length === 0) {
          throw new Error('Database health check failed');
        }
      });
      logInfo('Database health check: OK');
    } catch (error) {
      logError(`Database health check failed: ${error}`);
      throw error;
    }
  }

  private async checkSyncStatus(): Promise<void> {
    try {
      await dbService.transaction(async (manager: EntityManager) => {
        const result = await manager.query<
          {
            slot: number;
            blockHash: string;
            updatedAt: Date;
            currentTime: Date;
          }[]
        >(`
          SELECT slot, blockHash, updatedAt, CURRENT_TIMESTAMP as currentTime
          FROM syncs
          ORDER BY id DESC
          LIMIT 1
        `);

        if (!result || result.length === 0) {
          logWarning('No sync record found');
          return;
        }

        const syncRecord = result[0];
        const lastSyncTime = syncRecord.updatedAt.getTime();
        const currentTime = syncRecord.currentTime.getTime();
        const timeDiff = currentTime - lastSyncTime;
        const minutesSinceLastSync = timeDiff / (1000 * 60);

        if (minutesSinceLastSync > CONFIG.SYNC_STALE_THRESHOLD_MINUTES) {
          // @TODO: add alerting
          logWarning(
            `Sync potentially stalled: ${minutesSinceLastSync} minutes since last sync`
          );
        } else {
          logInfo(
            `Sync status: OK (last sync ${minutesSinceLastSync} minutes ago)`
          );
        }

        logInfo(
          `Current sync position: slot ${syncRecord.slot}, block ${syncRecord.blockHash}`
        );
      });
    } catch (error) {
      logError(`Sync status check failed: ${error}`);
      throw error;
    }
  }

  private checkMemoryUsage(): void {
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    const rssMB = Math.round(memUsage.rss / 1024 / 1024);

    logInfo(
      `Memory usage: RSS ${rssMB}MB, Heap ${heapUsedMB}/${heapTotalMB}MB`
    );

    if (heapUsedMB > 1000) {
      logWarning(`High memory usage detected: ${heapUsedMB}MB`);
    }

    if (rssMB > 2000) {
      logWarning(`High RSS memory usage detected: ${rssMB}MB`);
    }
  }
}
