import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appCreate } from 'src/app.create';
import { dropDatabase } from 'test/helpers/drop-database.helper';

describe('[Users] @Post Endpoints', () => {
  let app: INestApplication;
  let config: ConfigService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ConfigModule],
      providers: [ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();

    appCreate(app);

    config = app.get<ConfigService>(ConfigService);

    await app.init();
  });

  afterEach(async () => {
    await dropDatabase(config);
    await app.close();
  });

  it.todo('/users - Endpoint is public');
  it.todo('/users - firstName is mandatory');
  it.todo('/users - email is mandatory');
  it.todo('/users - password is mandatory');
  it.todo('/users - Valid request successfully creates user');
  it.todo('/users - password is not returned in response');
  it.todo('/users - googleId is not returned in response');
});
