import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.getUser(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
