import {
  Body,
  Controller,
  Delete,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { TagsService } from './providers/tags.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({
    summary: 'Creates a new tag',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if your tag is created successfully',
  })
  @Post()
  public createTags(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.createTag(createTagDto);
  }

  @Delete()
  public async deleteTags(@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.deleteTag(id);
  }

  // /tags/soft-delete
  @Delete('soft-delete')
  public async softDeleteTags(@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.softDeleteTag(id);
  }
}
