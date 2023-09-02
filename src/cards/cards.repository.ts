import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateCardDto } from './dto/create-card.dto';

/* eslint-disable */
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPT_KEY);

@Injectable()
export class CardsRepository {

  constructor(private readonly prisma: PrismaService) {}
  private SALT = 10;

  create(body: CreateCardDto, user: User) {
    return this.prisma.cards.create({
      data: {
        ...body,
        userId: user.id,
        password: cryptr.encrypt(body.password),
      },
    });
  }

  findUserLabel(body: CreateCardDto, user: User) {
    return this.prisma.cards.findFirst({
      where: {
        AND: [
          { userId: user.id },
          { label: body.label },
        ],
      },
    });
  }

  async findAll(user: User) {
    const cards = await this.prisma.cards.findMany( {where: {userId: user.id}})
    return cards;
  }

  async findOne(id: number) {
    const theOne = await this.prisma.cards.findFirst({
      where: { id },
    })

    return theOne;
  }

  remove(id: number) {
    return this.prisma.cards.delete({
      where: { id },
    });
  }

  removeAll(user: User) {
    return this.prisma.cards.deleteMany({
      where: { userId: user.id },
    });
  }
}
