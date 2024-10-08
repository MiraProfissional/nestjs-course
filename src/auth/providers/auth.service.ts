import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public login(id: string, email: string, password: string) {
    const user = this.usersService.findOneById('123');
    return 'SAMPLE_TOKEN';
  }

  public isAuth() {
    return true;
  }
}
