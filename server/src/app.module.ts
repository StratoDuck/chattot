import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { PrismaService } from './services/prisma.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService, UsersService, PrismaService, AuthService],
})
export class AppModule {}
