import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-options.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

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

    private readonly tagsService: TagsService,
  ) {}

  // Creating new posts
  public async createPost(createPostDto: CreatePostDto) {
    // Find author from database based on authorId
    const author = await this.usersService.findOneById(createPostDto.authorId);
    // Find Tags
    const tags = await this.tagsService.findMutipleTags(createPostDto.tags);

    // 2) Create post
    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
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

  public async updatePost(patchPostDto: PatchPostDto) {
    // Find the Tags
    const tags = await this.tagsService.findMutipleTags(patchPostDto.tags);

    // Find the Post
    const post = await this.postsRepository.findOneBy({ id: patchPostDto.id });

    // Update the properties
    post.title = patchPostDto.title ?? post.title; // { ...post, ...patchPostDto } sometimes can be bad
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    // Assing the new tags
    post.tags = tags;

    // Save the post
    return await this.postsRepository.save(post);
  }

  public async deletePost(id: number) {
    // Deleting the post
    await this.postsRepository.delete(id);

    // Confirmation
    return { deleted: true, id };
  }
}
