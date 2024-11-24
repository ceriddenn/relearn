import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class PreflightGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Example: Check if the user is authenticated (e.g., presence of a token)
    const userId = request.user.id; // Assuming `user` is attached by a middleware (e.g., Passport)

    const userQuery = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        account: true,
      },
    });

    if (!userQuery.signupComplete) {
      throw new HttpException(
        {
          statusCode: 510,
          message: 'Please complete the signup flow.',
          error: 'COMPLETE_SIGNUP_FALSE',
        },
        510,
      );
    }

    // if user logged in with no oauth and never verified email, denied
    if (!userQuery.emailVerified && userQuery.account.loginSolution == 'LOCAL')
      throw new HttpException(
        {
          statusCode: 510,
          message: 'Please verify your email',
          error: 'NO_VERIFIED_EMAIL',
        },
        510, // Custom status code
      );

    // if user logged in with phone and never set it then denied
    if (userQuery.account.loginSolution == 'SMS' && userQuery.phone.length == 0)
      throw new HttpException(
        {
          statusCode: 510,
          message: 'Please confirm your phone',
          error: 'NO_VERIFIED_PHONE',
        },
        510, // Custom status code
      );

    return true;
  }
}
