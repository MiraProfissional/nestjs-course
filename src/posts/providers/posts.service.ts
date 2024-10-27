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
    // 2) Create post
    const post = this.postsRepository.create(createPostDto);

    // 4) Return the post
    return await this.postsRepository.save(post);
  }

  public async findAll(userId: string) {
    const user = this.usersService.findOneById(userId);

    const post = await this.postsRepository.find();

    return post;
  }

  public async deletePost(id: number) {
    // Find the post (checking if exists)
    const post = await this.postsRepository.findOneBy({ id });

    const inversePost = await this.metaOptionsRepository.find({
      where: { id: post.metaOptions.id },
      relations: {
        post: true,
      },
    });

    console.log(inversePost);
    // Confirmation
    return { deleted: true, id };
  }
}
