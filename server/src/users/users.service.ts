import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';

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

  async getUserById(
    id: string,
    selectList: string[],
  ): Promise<Partial<User> | null> {
    const select: Prisma.UserSelect = selectList.reduce(
      (acc, field) => ({ ...acc, [field]: true }),
      {},
    );
    return this.prisma.user.findUnique({ select, where: { id } });
  }

  async getUserByEmail(
    email: string,
    selectList: string[],
  ): Promise<Partial<User> | null> {
    const select: Prisma.UserSelect = selectList.reduce(
      (acc, field) => ({ ...acc, [field]: true }),
      {},
    );

    return this.prisma.user.findUnique({
      where: { email },
      select,
    });
  }

  async createUser(signupForm: ISignUpForm): Promise<User> {
    return this.prisma.user.create({ data: signupForm });
  }
}
