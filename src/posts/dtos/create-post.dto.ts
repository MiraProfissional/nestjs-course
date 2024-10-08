import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';
import { CreatePostMetaOptionsDto } from './create-post-meta-options.dto';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  title: string;

  @IsNotEmpty()
  @IsEnum(postType, {
    message: 'Invalid post type',
  })
  postType: postType;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-a0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug shoud be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  slug: string;

  @IsNotEmpty()
  @IsEnum(postStatus, {
    message: 'Invalid status',
  })
  status: postStatus;

  @IsString()
  @IsOptional()
  content?: string;

  @IsJSON()
  @IsOptional()
  schema?: string;

  @IsUrl()
  @IsOptional()
  featuredImageUrl?: string;

  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @MinLength(3, { each: true })
  tags?: string[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto[];
}
