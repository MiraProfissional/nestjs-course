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
    // Find author from database based on authorId
    const author = await this.usersService.findOneById(createPostDto.authorId);

    // 2) Create post
    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
    });

    // 4) Return the post
    return await this.postsRepository.save(post);
  }

  public async findAll(userId: string) {
    const posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
      },
    });

    return posts;
  }

  public async deletePost(id: number) {
    // Deleting the post
    await this.postsRepository.delete(id);

    // Confirmation
    return { deleted: true, id };
  }
}
