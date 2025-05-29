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
  private intervals: Map<string, NodeJS.Timeout> = new Map();
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
    const interval = this.intervals.get(taskName);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(taskName);
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
        this.scheduleTask(task);
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
      const interval = this.intervals.get(taskName);
      if (interval) {
        clearInterval(interval);
        this.intervals.delete(taskName);
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
    for (const [taskName, interval] of this.intervals) {
      clearInterval(interval);
      logInfo(`Stopped cronjob task: ${taskName}`);
    }
    this.intervals.clear();
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
    const intervalMs = this.parseIntervalFromCron(task.cronExpression);

    if (intervalMs > 0) {
      const interval = setInterval(async () => {
        await this.executeTask(task);
      }, intervalMs);

      this.intervals.set(task.name, interval);
      logInfo(
        `Scheduled cronjob task: ${task.name} to run every ${intervalMs / 1000 / 60} minute(s)`
      );
    } else {
      logError(
        `Invalid cron expression for task ${task.name}: ${task.cronExpression}`
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

  /**
   * Parse interval from simplified cron expression.
   * Supports simple time expressions like 30s, 5m, 1h
   * and basic cron patterns like every N minutes or hours.
   */
  private parseIntervalFromCron(cronExpression: string): number {
    // Handle simple time expressions first
    const simpleTimeMatch = cronExpression.match(/^(\d+)(s|m|h)$/);
    if (simpleTimeMatch) {
      const value = parseInt(simpleTimeMatch[1]);
      const unit = simpleTimeMatch[2];

      switch (unit) {
        case 's':
          return value * 1000;
        case 'm':
          return value * 60 * 1000;
        case 'h':
          return value * 60 * 60 * 1000;
      }
    }

    // Handle cron expressions
    const parts = cronExpression.split(' ');
    if (parts.length !== 5) {
      return 0; // Invalid format
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    // Every minute pattern
    if (
      minute === '*' &&
      hour === '*' &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      return 60 * 1000;
    }

    // Every N minutes pattern
    const minuteIntervalMatch = minute.match(/^\*\/(\d+)$/);
    if (
      minuteIntervalMatch &&
      hour === '*' &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      return parseInt(minuteIntervalMatch[1]) * 60 * 1000;
    }

    // Every hour pattern
    if (
      minute === '0' &&
      hour === '*' &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      return 60 * 60 * 1000;
    }

    // Every N hours pattern
    const hourIntervalMatch = hour.match(/^\*\/(\d+)$/);
    if (
      minute === '0' &&
      hourIntervalMatch &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      return parseInt(hourIntervalMatch[1]) * 60 * 60 * 1000;
    }

    // Daily pattern
    if (
      minute === '0' &&
      hour === '0' &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      return 24 * 60 * 60 * 1000;
    }

    // Default fallback - treat as every hour
    logError(
      `Unsupported cron pattern: ${cronExpression}, defaulting to 1 hour`
    );
    return 60 * 60 * 1000;
  }
}
