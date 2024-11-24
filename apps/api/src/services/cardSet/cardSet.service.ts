import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
}
