import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-options.entity';

@Injectable()
export class PostsService {
  constructor(
    // Injecting Users Service
    private readonly usersService: UsersService,
    // Injecting postsRepository
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    // Injecting metaOptionsRepository
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  // Creating new posts
  public async createPost(@Body() createPostDto: CreatePostDto) {
    // 1) Create metaOptions
    const metaOptions = createPostDto.metaOptions
      ? this.metaOptionsRepository.create(createPostDto.metaOptions) // Checking if createPostDto.metaOptions is true
      : null;

    if (metaOptions) {
      await this.metaOptionsRepository.save(metaOptions);
    }
    // 2) Create post
    const post = this.postsRepository.create(createPostDto);

    // 3) Add metaOptions top the post
    if (metaOptions) {
      post.metaOptions = metaOptions;
    }

    // 4) Return the post
    return await this.postsRepository.save(post);
  }

  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);

    return [
      {
        user: user,
        title: 'Test Title',
        content: 'Test Content',
      },
      {
        user: user,
        title: 'Test Title 2',
        content: 'Test Content 2',
      },
    ];
  }
}
