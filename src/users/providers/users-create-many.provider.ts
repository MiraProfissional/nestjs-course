import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
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

    // 2. Connect Query Runner to datasource
    await queryRunner.connect();

    // 3. Start Transaction
    await queryRunner.startTransaction();

    try {
      for (const user of createManyUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);

        // 4.1. If successful commit
        await queryRunner.commitTransaction();
      }
    } catch (error) {
      // 4.2. If unsuccessful rollback
      await queryRunner.rollbackTransaction();
    } finally {
      // 5. Release connection
      await queryRunner.release();
    }

    return newUsers;
  }
}
