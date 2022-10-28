import { Controller, Post, Body } from '@nestjs/common';

import { AppService } from './app.service';
import { ISignUpForm } from './users/users.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/signup')
  async signup(@Body() body: ISignUpForm): Promise<string> {
    return this.appService.signup(body);
  }

  @Post('/login')
  login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): string {
    return this.appService.login(username, password);
  }
}
