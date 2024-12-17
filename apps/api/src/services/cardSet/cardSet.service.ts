import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Card, CardSet } from '@prisma/client';
import { PrismaService } from 'src/services/prisma/prisma.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class CardSetService {
  constructor(private prisma: PrismaService) {}

  async createCard(
    userId: string,
    title: string,
    description: string,
    cards: Card[],
    topic: string,
  ): Promise<CardSet> {
    // first check if any cards have blank terms or defintions
    cards.forEach((card) => {
      if (card.definition == '' || card.term == '')
        throw new BadRequestException(
          'Every card must have a term and definition.',
        );
    });
    try {
      const mutation = await this.prisma.cardSet.create({
        data: {
          title,
          description,
          topic,
          cards: {
            createMany: {
              data: cards,
            },
          },
          owner: {
            connect: {
              id: userId,
            },
          },
        },
        include: {
          cards: true,
        },
      });
      return mutation;
    } catch (error) {
      throw new InternalServerErrorException('An error occured.');
    }
  }

  async retrieveUserCards(userId: string): Promise<CardSet[]> {
    try {
      const query = await this.prisma.cardSet.findMany({
        where: {
          ownerId: userId,
        },
        include: {
          cards: true,
        },
      });
      return query;
    } catch (error) {
      throw new InternalServerErrorException('An error occured.');
    }
  }

  async retrieveSetCardsWithSetId(
    userId: string,
    setId: string,
  ): Promise<Card[] | null> {
    try {
      const query = await this.prisma.cardSet.findFirst({
        where: {
          id: setId,
          ownerId: userId,
        },
        include: {
          cards: true,
        },
      });
      return query.cards;
    } catch (error) {
      throw new InternalServerErrorException('An error occured.');
    }
  }

  async removeCardSet(userId: string, setId: string): Promise<void> {
    try {
      const query = await this.prisma.cardSet.findFirst({
        where: {
          id: setId,
        },
      });

      if (query.ownerId != userId)
        throw new BadRequestException(
          'Only the owner of a set can delete the set.',
        );

      await this.prisma.cardSet.delete({
        where: {
          id: setId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.response.message);
    }
  }
}
