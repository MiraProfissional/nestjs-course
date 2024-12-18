import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerSerivce: MailerService) {}

  public async sendUserWelcome(user: User): Promise<void> {
    await this.mailerSerivce.sendMail({
      to: user.email,
      from: `Onboarding Team <support@nestjs-blog.com>`,
      subject: 'Welcome to Nestjs Blog',
      html: `
        <h1>Welcome, ${user.firstName}!</h1>
        <p>Thank you for signing up for our platform.</p>
        <p>Your account details:</p>
        <ul>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Login URL:</strong> 
            <a href="http://localhost:8000">Click here to log in</a>
          </li>
        </ul>
        <p>Thanks!</p>
        <p><strong>NestJS Blog Team</strong></p>
      `,
    });
  }
}
