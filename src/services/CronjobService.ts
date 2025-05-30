import * as cron from 'node-cron';
import { ApiApplication } from '../ApiApplication';
import { IndexerApplication } from '../IndexerApplication';
import { logError, logInfo } from '../logger';
import { BaseService } from './BaseService';

export interface CronjobTask {
  name: string;
  cronExpression: string;
  handler: () => Promise<void>;
  enabled: boolean;
}

export class CronjobService extends BaseService {
  private tasks: Map<string, CronjobTask> = new Map();
  private scheduledTasks: Map<string, cron.ScheduledTask> = new Map();
  private isRunning: boolean = false;

  constructor() {
    super();
  }

  async boot(app: IndexerApplication | ApiApplication): Promise<void> {
    logInfo('Booting CronjobService...');
    this.isRunning = true;
    this.startScheduledTasks();
    logInfo('CronjobService booted successfully');
  }

  /**
   * Register a new cronjob task
   */
  registerTask(task: CronjobTask): void {
    // Validate cron expression
    if (!cron.validate(task.cronExpression)) {
      logError(
        `Invalid cron expression for task ${task.name}: ${task.cronExpression}`
      );
      return;
    }

    this.tasks.set(task.name, task);
    logInfo(
      `Registered cronjob task: ${task.name} with expression: ${task.cronExpression}`
    );

    if (this.isRunning && task.enabled) {
      this.scheduleTask(task);
    }
  }

  /**
   * Unregister a cronjob task
   */
  unregisterTask(taskName: string): void {
    const scheduledTask = this.scheduledTasks.get(taskName);
    if (scheduledTask) {
      scheduledTask.stop();
      scheduledTask.destroy();
      this.scheduledTasks.delete(taskName);
    }
    this.tasks.delete(taskName);
    logInfo(`Unregistered cronjob task: ${taskName}`);
  }

  /**
   * Enable a specific task
   */
  enableTask(taskName: string): void {
    const task = this.tasks.get(taskName);
    if (task) {
      task.enabled = true;
      if (this.isRunning) {
        if (this.scheduledTasks.has(taskName)) {
          logInfo(`Task ${taskName} is already scheduled.`);
        } else {
          this.scheduleTask(task);
        }
      }
      logInfo(`Enabled cronjob task: ${taskName}`);
    }
  }

  /**
   * Disable a specific task
   */
  disableTask(taskName: string): void {
    const task = this.tasks.get(taskName);
    if (task) {
      task.enabled = false;
      const scheduledTask = this.scheduledTasks.get(taskName);
      if (scheduledTask) {
        scheduledTask.stop();
        scheduledTask.destroy();
        this.scheduledTasks.delete(taskName);
      }
      logInfo(`Disabled cronjob task: ${taskName}`);
    }
  }

  /**
   * Get all registered tasks
   */
  getTasks(): CronjobTask[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Stop all cronjob tasks
   */
  stop(): void {
    this.isRunning = false;
    for (const [taskName, scheduledTask] of this.scheduledTasks) {
      scheduledTask.stop();
      scheduledTask.destroy();
      logInfo(`Stopped cronjob task: ${taskName}`);
    }
    this.scheduledTasks.clear();
  }

  /**
   * Start all enabled scheduled tasks
   */
  private startScheduledTasks(): void {
    for (const task of this.tasks.values()) {
      if (task.enabled) {
        this.scheduleTask(task);
      }
    }
  }

  /**
   * Schedule a single task
   */
  private scheduleTask(task: CronjobTask): void {
    try {
      const scheduledTask = cron.schedule(
        task.cronExpression,
        async () => {
          await this.executeTask(task);
        },
        {
          noOverlap: true,
        }
      );

      this.scheduledTasks.set(task.name, scheduledTask);
      scheduledTask.start();

      logInfo(
        `Scheduled cronjob task: ${task.name} with expression: ${task.cronExpression}`
      );
    } catch (error) {
      logError(
        `Failed to schedule task ${task.name} with expression ${task.cronExpression}: ${error}`
      );
    }
  }

  /**
   * Execute a cronjob task
   */
  private async executeTask(task: CronjobTask): Promise<void> {
    try {
      logInfo(`Executing cronjob task: ${task.name}`);
      await task.handler();
      logInfo(`Completed cronjob task: ${task.name}`);
    } catch (error) {
      logError(`Error executing cronjob task ${task.name}: ${error}`);
    }
  }
}
