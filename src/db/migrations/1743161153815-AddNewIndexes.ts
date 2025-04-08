import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddNewIndexes1743161153815 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'liquidity_pools',
      new TableIndex({
        name: 'idx_liquidity_pools_tokens',
        columnNames: ['tokenAId', 'tokenBId'],
      })
    );

    await queryRunner.createIndex(
      'assets',
      new TableIndex({
        name: 'idx_assets_policy_name',
        columnNames: ['policyId', 'nameHex'],
      })
    );

    await queryRunner.createIndex(
      'liquidity_pool_states',
      new TableIndex({
        name: 'idx_liquidity_pool_states_pool',
        columnNames: ['liquidityPoolId'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'liquidity_pools',
      'idx_liquidity_pools_tokens'
    );
    await queryRunner.dropIndex('assets', 'idx_assets_policy_name');
    await queryRunner.dropIndex(
      'liquidity_pool_states',
      'idx_liquidity_pool_states_pool'
    );
  }
}
