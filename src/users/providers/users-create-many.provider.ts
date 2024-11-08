import {
  Injectable,
  RequestTimeoutException,
  ConflictException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    // Injecting Datasource
    private readonly dataSource: DataSource,
  ) {}

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];

    // 1. Create Query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // 2. Connect Query Runner to datasource
      await queryRunner.connect();

      // 3. Start Transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException(
        'Unbale to process your request at the moment, please try later.',
        {
          description: `Error connecting to the database. ${String(error)}`,
        },
      );
    }

    try {
      for (const user of createManyUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      // 4.1. If successful commit
      await queryRunner.commitTransaction();
    } catch (error) {
      // 4.2. If unsuccessful rollback
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
    } finally {
      try {
        // 5. Release connection
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException('Could not release the connection', {
          description: String(error),
        });
      }
    }

    return newUsers;
  }
}
