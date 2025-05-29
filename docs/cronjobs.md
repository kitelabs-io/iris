# Cronjob Service Documentation

The Cronjob Service provides a robust way to schedule and execute recurring tasks within the Iris indexer application. It supports both simple time expressions and cron-like syntax for flexible scheduling.

## Features

- **Flexible Scheduling**: Supports both simple time expressions (`30s`, `5m`, `1h`) and cron-like syntax (`*/15 * * * *`)
- **Task Management**: Enable, disable, register, and unregister tasks dynamically
- **Error Handling**: Built-in error handling and logging for failed tasks
- **Health Monitoring**: Includes example health check cronjobs
- **Easy Integration**: Simple API for adding custom cronjobs

## Basic Usage

### 1. Creating a Custom Cronjob

Extend the `BaseCronjob` class to create your own cronjob:

```typescript
import { BaseCronjob } from '../jobs/BaseCronjob';
import { logInfo, logError } from '../logger';

export class MyCronjob extends BaseCronjob {
  constructor() {
    super('my-custom-job', '*/10 * * * *'); // Every 10 minutes
  }

  async execute(): Promise<void> {
    try {
      logInfo('Executing my custom cronjob...');
      
      // Your custom logic here
      await this.performTask();
      
      logInfo('My custom cronjob completed successfully');
    } catch (error) {
      logError(`My custom cronjob failed: ${error}`);
      throw error;
    }
  }

  private async performTask(): Promise<void> {
    // Implementation here
  }
}
```

### 2. Registering Cronjobs

#### Option A: Register during application startup

```typescript
import { IndexerApplication } from './IndexerApplication';
import { MyCronjob } from './jobs/MyCronjob';

const app = new IndexerApplication();

// Add custom cronjobs
app.withCronjobs([
  new MyCronjob(),
  // Add more cronjobs here
]);

await app.start();
```

#### Option B: Register using CronjobManager

```typescript
import { CronjobManager } from './utils/CronjobManager';
import { MyCronjob } from './jobs/MyCronjob';

const cronjobManager = CronjobManager.getInstance();

// Register a single cronjob
cronjobManager.registerCronjob(new MyCronjob());

// Register multiple cronjobs
cronjobManager.registerCronjobs([
  new MyCronjob(),
  new AnotherCronjob(),
]);
```

### 3. Managing Cronjobs

```typescript
const cronjobManager = CronjobManager.getInstance();

// Enable/disable cronjobs
cronjobManager.enableCronjob('my-custom-job');
cronjobManager.disableCronjob('my-custom-job');

// Execute a cronjob manually
await cronjobManager.executeCronjob('my-custom-job');

// Get cronjob status
const status = cronjobManager.getCronjobStatus();
console.log(status);

// Unregister a cronjob
cronjobManager.unregisterCronjob('my-custom-job');
```

## Scheduling Expressions

### Simple Time Expressions

- `30s` - Every 30 seconds
- `5m` - Every 5 minutes
- `1h` - Every hour

### Cron-like Expressions

The service supports a subset of cron syntax with 5 fields: `minute hour dayOfMonth month dayOfWeek`

#### Supported Patterns:

- `*/5 * * * *` - Every 5 minutes
- `0 * * * *` - Every hour (at minute 0)
- `0 */6 * * *` - Every 6 hours
- `0 0 * * *` - Daily at midnight
- `* * * * *` - Every minute

#### Examples:

```typescript
// Every 15 minutes
new MyCronjob('my-job', '*/15 * * * *');

// Every hour at minute 30
new MyCronjob('my-job', '30 * * * *');

// Daily at 2 AM
new MyCronjob('my-job', '0 2 * * *');

// Every 30 seconds (simple expression)
new MyCronjob('my-job', '30s');
```

## Built-in Cronjobs

The application comes with several pre-configured cronjobs:

### 1. UpdateTvlCronjob
- **Schedule**: Every 15 minutes (`*/15 * * * *`)
- **Purpose**: Updates TVL calculations for all liquidity pools
- **Description**: Recalculates total value locked across all active pools

### 2. CleanupCronjob
- **Schedule**: Daily at 2 AM (`0 2 * * *`)
- **Purpose**: Cleans up old data to maintain database performance
- **Actions**:
  - Removes transactions older than 90 days
  - Removes pool states older than 30 days
  - Removes old asset price records (keeps latest daily records)
  - Removes logs older than 14 days
  - Optimizes database tables

### 3. HealthCheckCronjob
- **Schedule**: Every 5 minutes (`*/5 * * * *`)
- **Purpose**: Monitors application health and performance
- **Checks**:
  - Database connectivity
  - Sync status and potential stalls
  - Transaction processing rate
  - Memory usage
  - Error log frequency

## Advanced Usage

### Custom Error Handling

```typescript
export class RobustCronjob extends BaseCronjob {
  private retryCount = 0;
  private maxRetries = 3;

  constructor() {
    super('robust-job', '5m');
  }

  async execute(): Promise<void> {
    try {
      await this.performTask();
      this.retryCount = 0; // Reset on success
    } catch (error) {
      this.retryCount++;
      
      if (this.retryCount < this.maxRetries) {
        logWarning(`Cronjob ${this.name} failed, retrying (${this.retryCount}/${this.maxRetries})`);
        // Optionally implement exponential backoff
        setTimeout(() => this.execute(), 1000 * this.retryCount);
      } else {
        logError(`Cronjob ${this.name} failed after ${this.maxRetries} retries`);
        this.retryCount = 0;
        throw error;
      }
    }
  }
}
```

### Conditional Execution

```typescript
export class ConditionalCronjob extends BaseCronjob {
  constructor() {
    super('conditional-job', '1h');
  }

  async execute(): Promise<void> {
    // Only run during business hours
    const hour = new Date().getHours();
    if (hour < 9 || hour > 17) {
      logInfo('Skipping cronjob outside business hours');
      return;
    }

    await this.performTask();
  }
}
```

### Database Transaction Support

```typescript
import { dbService } from '../indexerServices';
import { EntityManager } from 'typeorm';

export class DatabaseCronjob extends BaseCronjob {
  constructor() {
    super('database-job', '10m');
  }

  async execute(): Promise<void> {
    await dbService.transaction(async (manager: EntityManager) => {
      // All database operations within this block are transactional
      await manager.query('UPDATE SomeTable SET processed = true WHERE processed = false');
      
      const results = await manager.query('SELECT * FROM AnotherTable WHERE needs_update = true');
      
      for (const result of results) {
        await manager.query('UPDATE AnotherTable SET updated_at = NOW() WHERE id = ?', [result.id]);
      }
    });
  }
}
```

## Configuration

The cronjob service can be configured through environment variables:

```env
# Enable/disable specific cronjobs
CRONJOB_UPDATE_TVL_ENABLED=true
CRONJOB_CLEANUP_ENABLED=true
CRONJOB_HEALTH_CHECK_ENABLED=true

# Custom schedules
CRONJOB_UPDATE_TVL_SCHEDULE="*/15 * * * *"
CRONJOB_CLEANUP_SCHEDULE="0 2 * * *"
CRONJOB_HEALTH_CHECK_SCHEDULE="*/5 * * * *"
```

## Best Practices

1. **Keep executions lightweight**: Avoid long-running operations that might block other cronjobs
2. **Use database transactions**: Wrap database operations in transactions for consistency
3. **Implement proper error handling**: Always include try-catch blocks and meaningful error messages
4. **Log execution details**: Include start, progress, and completion logs
5. **Make tasks idempotent**: Ensure tasks can be safely re-run without side effects
6. **Monitor performance**: Track execution times and resource usage
7. **Use appropriate schedules**: Don't run resource-intensive tasks too frequently

## Troubleshooting

### Common Issues

1. **Cronjob not executing**
   - Check if the cronjob is enabled: `cronjobManager.getCronjobStatus()`
   - Verify the cron expression syntax
   - Check application logs for errors

2. **Database connection errors**
   - Ensure database service is running
   - Check database connection pool settings
   - Verify database credentials

3. **Memory issues**
   - Monitor memory usage in health checks
   - Implement proper cleanup in cronjobs
   - Consider reducing execution frequency

4. **Performance problems**
   - Use database indexes for cronjob queries
   - Implement batching for large data operations
   - Monitor execution times

### Debugging

Enable debug logging to see detailed cronjob execution information:

```typescript
// In your cronjob
logInfo(`Starting ${this.name} execution at ${new Date().toISOString()}`);
// ... your logic
logInfo(`Completed ${this.name} execution in ${executionTime}ms`);
```

## API Reference

### BaseCronjob

Abstract base class for all cronjobs.

#### Constructor
```typescript
constructor(name: string, cronExpression: string)
```

#### Methods
- `abstract execute(): Promise<void>` - Implement your cronjob logic
- `enable(): void` - Enable the cronjob
- `disable(): void` - Disable the cronjob
- `isEnabled(): boolean` - Check if cronjob is enabled

### CronjobService

Main service for managing cronjobs.

#### Methods
- `registerTask(task: CronjobTask): void`
- `unregisterTask(taskName: string): void`
- `enableTask(taskName: string): void`
- `disableTask(taskName: string): void`
- `getTasks(): CronjobTask[]`
- `stop(): void`

### CronjobManager

Utility class for easier cronjob management.

#### Methods
- `registerCronjob(cronjob: BaseCronjob): void`
- `registerCronjobs(cronjobs: BaseCronjob[]): void`
- `unregisterCronjob(name: string): void`
- `enableCronjob(name: string): void`
- `disableCronjob(name: string): void`
- `executeCronjob(name: string): Promise<void>`
- `getCronjobs(): BaseCronjob[]`
- `getCronjobStatus(): Array<{name: string, cronExpression: string, enabled: boolean}>`