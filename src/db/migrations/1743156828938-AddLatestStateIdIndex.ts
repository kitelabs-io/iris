import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddLatestStateIdIndex1743156828938 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'liquidity_pools',
      new TableIndex({
        columnNames: ['latestStateId'],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'liquidity_pools',
      new TableIndex({
        columnNames: ['latestStateId'],
        isUnique: true,
      })
    );
  }
}
