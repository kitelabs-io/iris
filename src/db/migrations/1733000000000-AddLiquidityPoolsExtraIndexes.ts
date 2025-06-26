import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLiquidityPoolsExtraIndexes1733000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Check for any index on latestStateId (single column)
    const [existingLatestStateIdx] = await queryRunner.query(`
      SELECT index_name
      FROM information_schema.statistics
      WHERE table_schema = DATABASE()
        AND table_name = 'liquidity_pools'
        AND column_name = 'latestStateId'
      GROUP BY index_name
      HAVING COUNT(*) = 1
      LIMIT 1
    `);
    if (!existingLatestStateIdx) {
      await queryRunner.query(`
        CREATE INDEX IDX_liquidity_pools_latestStateId
        ON liquidity_pools(latestStateId)
      `);
    }

    // 2. Check for any index on dex (single column)
    const [existingDexIdx] = await queryRunner.query(`
      SELECT index_name
      FROM information_schema.statistics
      WHERE table_schema = DATABASE()
        AND table_name = 'liquidity_pools'
        AND column_name = 'dex'
      GROUP BY index_name
      HAVING COUNT(*) = 1
      LIMIT 1
    `);
    if (!existingDexIdx) {
      await queryRunner.query(`
        CREATE INDEX IDX_liquidity_pools_dex
        ON liquidity_pools(dex)
      `);
    }

    // 3. Check for any index on (tokenAId, tokenBId) or (tokenBId, tokenAId)
    //    Since MySQL does not support functional indexes on expressions directly,
    //    this check is for a two-column index on tokenAId and tokenBId in any order.
    //    If you use generated columns for the expressions, adjust accordingly.
    const [existingTokenPairIdx] = await queryRunner.query(`
      SELECT index_name
      FROM information_schema.statistics
      WHERE table_schema = DATABASE()
        AND table_name = 'liquidity_pools'
        AND (column_name = 'tokenAId' OR column_name = 'tokenBId')
      GROUP BY index_name
      HAVING COUNT(*) = 2
      LIMIT 1
    `);
    if (!existingTokenPairIdx) {
      // Attempt to create the functional index.
      // If your MySQL version does not support this, you may need to use generated columns.
      await queryRunner.query(`
        CREATE INDEX IDX_tokenPair_bidirectional
        ON liquidity_pools((tokenAId + tokenBId), (tokenAId * tokenBId))
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Do not remove the indices on down
  }
}
