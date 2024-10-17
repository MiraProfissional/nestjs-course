import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from '../dtos/create-user.dto';

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
  ) {}

  // Creating function for create users in the database
  public async createUser(createUserDto: CreateUserDTO) {
    // Checking if already exist an user with same email
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    // Handle exception
    // Create a new user
    let newUser = this.userRepository.create(createUserDto);
    newUser = await this.userRepository.save(newUser);

    return newUser;
  }

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
