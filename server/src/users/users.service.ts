import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../services/prisma.service';

export interface ISignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(signupForm: ISignUpForm): Promise<User> {
    return this.prisma.user.create({ data: signupForm });
  }
}
