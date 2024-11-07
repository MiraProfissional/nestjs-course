import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';

/** Class to connect to Users table and perform business operations */
@Injectable()
export class UsersService {
  /** The constructor to connect AuthService with UsersService by Dependency Injection*/
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    /* 
    Injecting usersRepository
    */
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    // Injecting Datasource
    private readonly dataSource: DataSource,2
  ) {}

  // Creating function for create users in the database
  public async createUser(createUserDto: CreateUserDto) {
    let existingUser = undefined;

    try {
      // Checking if already exist an user with same email
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      // Might save the details of the exception
      // Information which is sensitive
      throw new RequestTimeoutException(
        'Unbale to process your request at the moment, please try later.',
        {
          description: 'Error connecting to the database.',
        },
      );
    }

    // Handle exception
    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email.',
      );
    }

    // Create a new user
    let newUser = this.userRepository.create(createUserDto);

    try {
      newUser = await this.userRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unbale to process your request at the moment, please try later.',
        {
          description: 'Error connecting to the database.',
        },
      );
    }

    return newUser;
  }

  /** The method to get all the users from the database */
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API endpoint does not exist',
        fileName: 'users.service.ts',
        lineNumber: 88,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: 'Occured because the API endpoint was permanently moved',
      },
    );
  }

  /** The method to get one specific user by your ID from the database */
  public async findOneById(id: number) {
    let user = undefined;
    try {
      user = await this.userRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unbale to process your request at the moment, please try later.',
        {
          description: 'Error connecting to the database.',
        },
      );
    }

    // Handle the user does not exist
    if (!user) {
      throw new BadRequestException('The user ID does not exist');
    }

    return user;
  }

  public async createMany(createUsersDto: CreateUserDto[]) {
    let newUsers: User[] = []

    // 1. Create Query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();

    // 2. Connect Query Runner to datasource
    await queryRunner.connect();
    
    // 3. Start Transaction
    await queryRunner.startTransaction();

    try {
      for(let user of createUsersDto) {
        let newUser = queryRunner.manager.create(User,user);
        let result = await queryRunner.manager.save(newUser);
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
