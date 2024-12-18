import { Module, Global } from '@nestjs/common';
import { MailService } from './providers/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('appConfig.mailHost'),
          secure: false,
          port: 2525,
          auth: {
            user: config.get('appConfig.smtpUsername'),
            pass: config.get('appConfig.smtpPassword'),
          },
          default: {
            from: `My blog <no-reply@nestjs-blog.com>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new EjsAdapter(),
            options: {
              strinct: false,
            },
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
