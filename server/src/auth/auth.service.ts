import * as bcrypt from 'bcrypt';
import { isEmail } from 'validator';
import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, Prisma } from '@prisma/client';

import { UsersService } from '../users/users.service';
import { ISignUpForm } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async saltAndHashPassword(password) {
    const salt = await bcrypt.genSalt(+process.env.BCRYPT_SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  async validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const user = await this.usersService.getUserByEmail(email, [
      'id',
      'firstName',
      'lastName',
      'email',
      'password',
    ]);

    if (!user || !(await this.validatePassword(password, user.password))) {
      return null;
    }

    delete user.password;
    return user;
  }

  async login(user: Partial<User>) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(form: ISignUpForm): Promise<{ access_token: string }> {
    // TODO: Add better validation
    if (!isEmail(form.email)) {
      throw new Error('Incorrect email format.');
    }

    form = {
      ...form,
      password: await this.saltAndHashPassword(form.password),
    };
    let user;

    try {
      user = await this.usersService.createUser(form);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already in use');
      } else {
        throw error;
      }
    }

    const token = await this.login(user);

    return token;
  }
}
