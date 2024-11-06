/*

Code written 10/2024 - 2024 Finnean Carmichael / ReLearn

*/
import { Module } from '@nestjs/common';
import { CardSetController } from 'src/controllers/users/cardSet.controller';
import { CardSetService } from 'src/services/cardSet/cardSet.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { JwtStrategy } from 'src/strats/jwt.strategy';

@Module({
  controllers: [CardSetController],
  providers: [PrismaService, CardSetService, JwtStrategy],
})
export class UsersModule { }
