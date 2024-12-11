import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';
import { PaginationModule } from './common/pagination/pagination.module';
import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
import { UploadsModule } from './uploads/uploads.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation,
      // validationOptions: {
      //   abortEarly: false, // Opcional: mostra todos os erros ao invés de parar no primeiro
      //   // allowUnknown: false, // Opcional: não permite variáveis desconhecidas no .env (Tem que definir um monte de coisas...)
      // },
    }),
    UsersModule,
    PostsModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Default options
        type: 'postgres',

        // entities: [User],
        autoLoadEntities: configService.get('database.autoLoadEntities'),

        // Only in development mode
        synchronize: configService.get('database.synchronize'),

        // Postrgres options
        host: configService.get('database.host'),
        port: Number(configService.get('database.port')),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
      }),
    }),
    TagsModule,
    MetaOptionsModule,
    PaginationModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: DataResponseInterceptor },
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    AccessTokenGuard,
  ],
})
export class AppModule {}
