import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersParamDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number) //This was used because the URL is a string, so we need to transform the param into a number
  id?: number;
}
