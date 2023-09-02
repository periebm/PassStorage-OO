import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { User } from '@prisma/client';
import { CardsRepository } from './cards.repository';

/* eslint-disable */
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPT_KEY);
@Injectable()
export class CardsService {
  constructor(private readonly cardsRepository: CardsRepository) {}

  async create(createCardDto: CreateCardDto, user: User) {
    await this.findCardsWithSameName(createCardDto, user);
    return await this.cardsRepository.create(createCardDto, user);
  }

  async findAll(user: User) {
    const cards = await this.cardsRepository.findAll(user);
    return cards.map((e) => {
      return {...e, password: cryptr.decrypt(e.password)}
    })
  }

  async findOne(id: number, user: User) {
    const card = await this.cardsRepository.findOne(id);
    if (!card) throw new NotFoundException();
    if (card.userId !== user.id) throw new ForbiddenException();

    return {...card, password: cryptr.decrypt(card.password)};;
  }

  async remove(id: number, user: User) {
    const card = await this.cardsRepository.findOne(id);
    if (!card) throw new NotFoundException();
    if (card.userId !== user.id) throw new ForbiddenException();

    return await this.cardsRepository.remove(id);
  }

  async removeAll(user: User) {
    return await this.cardsRepository.removeAll(user);
  }

  async findCardsWithSameName(
    createCardDto: CreateCardDto,
    user: User,
  ) {
    const label = await this.cardsRepository.findUserLabel(
      createCardDto,
      user,
    );

    if (label) throw new ConflictException();
  }
}
