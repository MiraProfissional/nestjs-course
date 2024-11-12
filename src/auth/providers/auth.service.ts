import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public signIn(signInDto: SignInDto) {
    // Find the user using email ID
    // Compare the password
    // Return a confirmation
  }

  public isAuth() {
    return true;
  }
}
