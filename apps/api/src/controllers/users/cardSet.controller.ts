import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Card } from '@prisma/client';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CardSetService } from 'src/services/cardSet/cardSet.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { PreflightGuard } from 'src/strats/preflight.strategy';

@Controller('cardset')
export class CardSetController {
  constructor(
    private readonly cardSetService: CardSetService,
    private prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard, PreflightGuard)
  @Post('/s/actions')
  async createSet(
    @Request() req,
    @Body('title') title,
    @Body('topic') topic,
    @Body('description') description,
    @Body('cards') cards: Card[],
  ) {
    if ((topic as string).length > 20) {
      throw new BadRequestException('The topic needs to be shorter.');
    }
    if ((description as string).length > 40) {
      throw new BadRequestException('The description needs to be shorter.');
    }
    if (!title) throw new BadRequestException('Please provide a title.');
    if (!cards || cards.length < 2)
      throw new BadRequestException(
        'To create a cardset we need at least 2 cards.',
      );

    const userId = req.user.id;

    const result = await this.cardSetService.createCard(
      userId,
      title,
      description,
      cards,
      topic,
    );

    return result;
  }

  @Get('/s')
  async get1(@Request() req) {
    return { headers: req };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/s/actions')
  async getAllCards(@Request() req) {
    const userId = req.user.id;
    const result = await this.cardSetService.retrieveUserCards(userId);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/s/actions')
  async removeCard(@Request() req, @Body('setId') setId) {
    await this.cardSetService.removeCardSet(req.user.id, setId);

    return { message: 'Removed successfully.', code: 200 };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/s/cards/:setId')
  async getSetCards(@Request() req, @Param('setId') setId) {
    if (!setId)
      throw new BadRequestException('Please provide a set id with the request');
    const result = await this.cardSetService.retrieveSetCardsWithSetId(
      req.user.id,
      setId,
    );
    return result;
  }
}
