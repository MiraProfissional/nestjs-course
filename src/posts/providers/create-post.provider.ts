import {
  BadRequestException,
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { ActiveUserData } from 'src/auth/active-user.interface';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class CreatePostProvider {
  constructor(
    // Injecting postsRepository
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    // Injecting usersService
    private readonly usersService: UsersService,

    private readonly tagsService: TagsService,
  ) {}
  public async createPost(createPostDto: CreatePostDto, user: ActiveUserData) {
    // Find author from database based on authorId
    let author = undefined;
    try {
      author = await this.usersService.findOneById(user.sub);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    // Find Tags
    let tags = undefined;
    try {
      tags = await this.tagsService.findMutipleTags(createPostDto.tags);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    if (createPostDto.tags.length != tags.length) {
      throw new BadRequestException('Please check your tags IDs');
    }

    // 2) Create post
    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    try {
      // 4) Return the post
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure post slug is unique and not  a duplicate',
      });
    }
  }
}
