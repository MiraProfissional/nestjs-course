import { Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';

@Injectable()
export class UsersService {
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
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

  public findOneById(id: number) {
    return {
      id: 123,
      firstName: 'Alice',
      email: 'alice@email.com',
    };
  }
}
