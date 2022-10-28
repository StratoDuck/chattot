import { Injectable } from '@nestjs/common';
import { isEmail } from 'validator';

import { UsersService, ISignUpForm } from './users/users.service';
import { AuthService } from './services/auth.service';

@Injectable()
export class AppService {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  async signup(form: ISignUpForm): Promise<string> {
    if (!isEmail(form.email)) {
      throw new Error('Incorrect email format.');
    }
    form = {
      ...form,
      password: this.authService.saltAndHashPassword(form.password),
    };
    await this.usersService.createUser(form);
    return 'token';
  }

  login(username: string, password: string): string {
    return `${username}:${password}`;
  }
}
