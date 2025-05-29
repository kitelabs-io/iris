export abstract class BaseCronjob {
  public readonly name: string;
  public readonly cronExpression: string;
  public enabled: boolean = true;

  protected constructor(name: string, cronExpression: string) {
    this.name = name;
    this.cronExpression = cronExpression;
  }

  abstract execute(): Promise<void>;

  public enable(): void {
    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }
}