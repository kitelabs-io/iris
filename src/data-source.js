import 'reflect-metadata';
import { DataSource } from 'typeorm';

// Note: used for data migration, local only
export const AppDataSource = new DataSource({
  type: 'postgres', // or your database type
  host: 'localhost',
  port: 5432,
  username: 'atlas',
  password: 'atlas123',
  database: 'iris',
  synchronize: false,
  logging: true,
  entities: ['src/db/entities/**/*.ts'],
  migrations: ['src/db/migrations/**/*.ts'],
  migrationsTableName: 'migrations',
});
