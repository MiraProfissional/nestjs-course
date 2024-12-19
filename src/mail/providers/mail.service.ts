import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import path from 'path';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerSerivce: MailerService) {}

  public async sendUserWelcome(user: User): Promise<void> {
    await this.mailerSerivce.sendMail({
      to: user.email,
      from: `Onboarding Team <support@nestjs-blog.com>`,
      subject: 'Welcome to Nestjs Blog',
      template: path.join(__dirname, '..'),
      context: {
        name: user.firstName,
        email: user.email,
        loginUrl: 'http://localhost:8000',
      },
    });
  }
}
