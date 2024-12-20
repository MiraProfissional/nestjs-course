import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export async function dropDatabase(config: ConfigService): Promise<void> {
  // Create the connection datasource
  const appDataSource = await new DataSource({
    type: 'postgres',
    synchronize: config.get('database.synchronize'),
    host: config.get('database.host'),
    port: Number(config.get('database.port')),
    username: config.get('database.username'),
    password: config.get('database.password'),
    database: config.get('database.name'),
  }).initialize();

  // Drop all tables
  await appDataSource.dropDatabase();

  // Close the connection
  await appDataSource.destroy();
}
