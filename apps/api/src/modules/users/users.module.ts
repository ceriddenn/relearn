/*

Code written 10/2024 - 2024 Finnean Carmichael / ReLearn

*/
import { Module } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { UsersController } from 'src/controllers/users/users.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { JwtStrategy } from 'src/strats/jwt.strategy';

@Module({
  controllers: [UsersController],
  providers: [PrismaService, UsersService, JwtStrategy],
  exports: [UsersService]
})
export class UsersModule { }
