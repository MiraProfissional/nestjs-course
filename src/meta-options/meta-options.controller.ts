import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';
import { MetaOptionsService } from './providers/meta-options.service';

@Controller('meta-options')
@ApiTags('Meta Options')
export class MetaOptionsController {
  constructor(private readonly metaOptionService: MetaOptionsService) {}

  @Post()
  public createMetaOptions(
    @Body() createMetaOptionsDto: CreatePostMetaOptionsDto,
  ) {
    return this.metaOptionService.createMetaOption(createMetaOptionsDto);
  }
}
