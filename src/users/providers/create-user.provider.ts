import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    //Inject usersRepository
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    //Inject hashingProvider
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    private readonly mailService: MailService,
  ) {}
  public async createUser(createUserDto: CreateUserDto) {
    let existingUser = undefined;

    try {
      // Checking if already exist an user with same email
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch {
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
    let newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    try {
      newUser = await this.userRepository.save(newUser);
    } catch {
      throw new RequestTimeoutException(
        'Unbale to process your request at the moment, please try later.',
        {
          description: 'Error connecting to the database.',
        },
      );
    }

    try {
      await this.mailService.sendUserWelcome(newUser);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    return newUser;
  }
}
