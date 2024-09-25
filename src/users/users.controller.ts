import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  public getUsers() {
    return 'You sent a GET request to users endpoint';
  }

  @Post()
  public createUsers() {
    return 'You sent a POST request to users endpoint';
  }
}
