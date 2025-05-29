import { cronjobService } from '../indexerServices';
import { BaseCronjob } from '../jobs/BaseCronjob';
import { logInfo, logError } from '../logger';

export class CronjobManager {
  private static instance: CronjobManager;
  private registeredCronjobs: Map<string, BaseCronjob> = new Map();

  private constructor() {}

  public static getInstance(): CronjobManager {
    if (!CronjobManager.instance) {
      CronjobManager.instance = new CronjobManager();
    }
    return CronjobManager.instance;
  }

  /**
   * Register and start a cronjob
   */
  public registerCronjob(cronjob: BaseCronjob): void {
    this.registeredCronjobs.set(cronjob.name, cronjob);
    
    cronjobService.registerTask({
      name: cronjob.name,
      cronExpression: cronjob.cronExpression,
      handler: () => cronjob.execute(),
      enabled: cronjob.isEnabled(),
    });

    logInfo(`Registered cronjob: ${cronjob.name}`);
  }

  /**
   * Register multiple cronjobs at once
   */
  public registerCronjobs(cronjobs: BaseCronjob[]): void {
    cronjobs.forEach(cronjob => this.registerCronjob(cronjob));
  }

  /**
   * Unregister a cronjob
   */
  public unregisterCronjob(name: string): void {
    if (this.registeredCronjobs.has(name)) {
      this.registeredCronjobs.delete(name);
      cronjobService.unregisterTask(name);
      logInfo(`Unregistered cronjob: ${name}`);
    } else {
      logError(`Cronjob not found: ${name}`);
    }
  }

  /**
   * Enable a cronjob
   */
  public enableCronjob(name: string): void {
    const cronjob = this.registeredCronjobs.get(name);
    if (cronjob) {
      cronjob.enable();
      cronjobService.enableTask(name);
      logInfo(`Enabled cronjob: ${name}`);
    } else {
      logError(`Cronjob not found: ${name}`);
    }
  }

  /**
   * Disable a cronjob
   */
  public disableCronjob(name: string): void {
    const cronjob = this.registeredCronjobs.get(name);
    if (cronjob) {
      cronjob.disable();
      cronjobService.disableTask(name);
      logInfo(`Disabled cronjob: ${name}`);
    } else {
      logError(`Cronjob not found: ${name}`);
    }
  }

  /**
   * Get all registered cronjobs
   */
  public getCronjobs(): BaseCronjob[] {
    return Array.from(this.registeredCronjobs.values());
  }

  /**
   * Get a specific cronjob by name
   */
  public getCronjob(name: string): BaseCronjob | undefined {
    return this.registeredCronjobs.get(name);
  }

  /**
   * Execute a cronjob manually
   */
  public async executeCronjob(name: string): Promise<void> {
    const cronjob = this.registeredCronjobs.get(name);
    if (cronjob) {
      logInfo(`Manually executing cronjob: ${name}`);
      try {
        await cronjob.execute();
        logInfo(`Manual execution completed for cronjob: ${name}`);
      } catch (error) {
        logError(`Manual execution failed for cronjob ${name}: ${error}`);
        throw error;
      }
    } else {
      throw new Error(`Cronjob not found: ${name}`);
    }
  }

  /**
   * Get cronjob status
   */
  public getCronjobStatus(): Array<{
    name: string;
    cronExpression: string;
    enabled: boolean;
  }> {
    return Array.from(this.registeredCronjobs.values()).map(cronjob => ({
      name: cronjob.name,
      cronExpression: cronjob.cronExpression,
      enabled: cronjob.isEnabled(),
    }));
  }

  /**
   * Stop all cronjobs
   */
  public stopAll(): void {
    cronjobService.stop();
    logInfo('All cronjobs stopped');
  }
}