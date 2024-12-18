// src/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.RELEARN_JWT_SECRET, // Use the same secret as in JwtModule
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.prismaService.account.findFirst({
      where: {
        id: payload.accountId,
      },
      include: {
        user: true,
      },
    });
    console.log(payload);
    if (!user) {
      throw new UnauthorizedException('No user found.');
    }
    const tokenIssuedAt = new Date(payload.iat * 1000); // Convert iat to milliseconds
    if (user.lastLogout && tokenIssuedAt < user.lastLogout) {
      throw new UnauthorizedException(
        'Token has been invalidated due to logout',
      );
    }

    return user.user[0]; // The user object will be attached to the request object
    // ex. req.user = above returned statement.
  }
}
