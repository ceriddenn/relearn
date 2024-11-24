import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Card } from '@prisma/client';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CardSetService } from 'src/services/cardSet/cardSet.service';

@Controller('cardset')
export class CardSetController {
  constructor(private readonly cardSetService: CardSetService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/s/actions')
  async createSet(
    @Request() req,
    @Body('title') title,
    @Body('description') description,
    @Body('cards') cards: Card[],
  ) {
    if (!title) throw new BadRequestException('Please provide a title.');
    if (!description)
      throw new BadRequestException('Please provide a description.');
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
    );

    return result;
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
  async removeCard() {}
}
