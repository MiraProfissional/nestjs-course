import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';

/** Class to connect to Users table and perform business operations */
@Injectable()
export class UsersService {
  /** The constructor to connect AuthService with UsersService by Dependency Injection*/
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  /** The method to get all the users from the database */
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);

    return [
      {
        firstName: 'John',
        email: 'john@email.com',
      },
      {
        firstName: 'Joana',
        email: 'joana@email.com',
      },
    ];
  }

  /** The method to get one specific user by your ID from the database */
  public findOneById(id: string) {
    return {
      id: 123,
      firstName: 'Alice',
      email: 'alice@email.com',
    };
  }
}
