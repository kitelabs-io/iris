import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertAdaAssetIfNotExists1733000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if ADA asset already exists
    const existingAda = await queryRunner.query(`
      SELECT id FROM assets
      WHERE policyId = '' AND nameHex = ''
      LIMIT 1
    `);

    // Only insert if ADA asset doesn't exist
    if (!existingAda || existingAda.length === 0) {
      await queryRunner.query(`
        INSERT INTO assets (policyId, nameHex, isLpToken, isVerified, decimals, name, ticker, logo, description, meta)
        VALUES('', '', 0, 1, 6, 'ADA', 'ADA', NULL, NULL, NULL)
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the ADA asset if it was inserted by this migration
    await queryRunner.query(`
      DELETE FROM assets
      WHERE policyId = '' AND nameHex = '' AND name = 'ADA' AND ticker = 'ADA'
    `);
  }
}
