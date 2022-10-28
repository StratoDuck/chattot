import * as crypto from 'crypto';
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
  md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
  }

  generateSalt() {
    const set =
      '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    let salt = '';
    [...Array(10).keys()].forEach(() => {
      const p = Math.floor(Math.random() * set.length);
      salt += set[p];
    });
    return salt;
  }

  saltAndHashPassword(password) {
    const salt = this.generateSalt();
    return salt + this.md5(password + salt);
  }

  validatePassword(plainPassword, hashedPassword) {
    const salt = hashedPassword.substr(0, 10);
    const validHash = salt + this.md5(plainPassword + salt);
    return hashedPassword === validHash;
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

    if (!user || !this.validatePassword(password, user.password)) {
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
      password: this.saltAndHashPassword(form.password),
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
