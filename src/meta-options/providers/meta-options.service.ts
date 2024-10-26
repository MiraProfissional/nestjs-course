import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../meta-options.entity';
import { Repository } from 'typeorm';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-meta-options.dto';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private metaOptionRepository: Repository<MetaOption>,
  ) {}

  public async createMetaOption(
    createMetaOptionsDto: CreatePostMetaOptionsDto,
  ) {
    let newMetaOption = this.metaOptionRepository.create(createMetaOptionsDto);

    newMetaOption = await this.metaOptionRepository.save(newMetaOption);

    return newMetaOption;
  }
}
