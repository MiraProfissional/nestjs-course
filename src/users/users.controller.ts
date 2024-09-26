import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  @Get('/:id?')
  public getUsers(
    @Param('id', ParseIntPipe) id: number | undefined,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    console.log(limit);
    console.log(page);
    return 'You sent a GET request to users endpoint';
  }

  @Post()
  public createUsers(@Body() createUserDto: CreateUserDTO) {
    console.log(createUserDto instanceof CreateUserDTO);
    return 'You sent a POST request to users endpoint';
  }
}
