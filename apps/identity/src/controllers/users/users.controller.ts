import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UsersService } from 'src/services/users/users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get('/')
  userRes(@Request() req) {
    return { user: req.user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/username')
  async updateUsername(@Request() req, @Body('username') username) {
    if (!username) throw new BadRequestException('Please provide a username');

    await this.userService.allowedToChangeUsername(req.user.id);

    const result = await this.userService.updateUsername(username, req.user.id);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/name')
  async updateName(@Request() req, @Body('name') name) {
    if (!name) throw new BadRequestException('Please provide a name.');
    const result = await this.userService.updateName(name, req.user.id);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/account')
  async userAccount(@Request() req) {
    const account = await this.userService.findAccountById(req.user.accountId);
    return { account: account };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/signupstate')
  async userSignupState(@Request() req) {
    const hasCompletedSignup = await this.userService.hasCompletedSignup(
      req.user.id,
    );
    return { state: hasCompletedSignup };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/preflight/verify')
  async passedChecks(@Request() req) {
    const result = await this.userService.passedPreflightChecks(req.user.id);
    return result;
  }
}
