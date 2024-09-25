import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/:id/:optional?')
  public getUsers(@Param() params: any, @Query() query: any) {
    console.log(params);
    console.log(query);
    return 'You sent a GET request to users endpoint';
  }

  @Post()
  public createUsers(@Body() request: any) {
    console.log(request);
    return 'You sent a POST request to users endpoint';
  }
}

/* 

import { Req } from '@nestjs/common';
import { Request } from 'express';

@Post()
  public createUsers(@Req() request: Request) {
    console.log(request);
    return 'You sent a POST request to users endpoint';
  }

*/
