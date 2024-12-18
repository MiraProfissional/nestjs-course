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
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { GoogleUser } from '../interfaces/google-user.interface';

/** Class to connect to Users table and perform business operations */
@Injectable()
export class UsersService {
  /** The constructor to connect AuthService with UsersService by Dependency Injection*/
  constructor(
    /* 
    Injecting usersRepository
    */
    @InjectRepository(User)
    private userRepository: Repository<User>,

    // Injecting usersCreateManyProvider
    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    // Inject createUserProvider
    private readonly createUserProvider: CreateUserProvider,

    private readonly createGoogleUserProvider: CreateGoogleUserProvider,

    //Inject findOneUserByEmailProvider
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,

    private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,
  ) {}

  // Creating function for create users in the database
  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
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
    } catch {
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

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }

  public async findOneByEmail(email: string) {
    return await this.findOneUserByEmailProvider.findOneByEmail(email);
  }

  public async findOneByGoogleId(googleId: string) {
    return await this.findOneByGoogleIdProvider.findOneByGoogleId(googleId);
  }

  public async createGoogleUser(googleUser: GoogleUser) {
    return await this.createGoogleUserProvider.createGoogleUser(googleUser);
  }
}
