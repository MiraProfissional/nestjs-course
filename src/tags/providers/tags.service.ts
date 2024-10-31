import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from '../dtos/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  public async createTag(createTagDto: CreateTagDto) {
    const tag = this.tagsRepository.create(createTagDto);

    return await this.tagsRepository.save(tag);
  }

  public async findMutipleTags(tagIds: number[]) {
    return await this.tagsRepository.find({
      where: {
        id: In(tagIds),
      },
    });
  }

  public async deleteTag(id: number) {
    await this.tagsRepository.delete(id);

    return { deleted: true, id };
  }

  public async softDeleteTag(id: number) {
    await this.tagsRepository.softDelete(id);

    return { deleted: true, id };
  }
}
