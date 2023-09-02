import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as user_p } from '@prisma/client';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createCardDto: CreateCardDto, @User() user: user_p) {
    return this.cardsService.create(createCardDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@User() user: user_p) {
    return this.cardsService.findAll(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @User() user: user_p) {
    return this.cardsService.findOne(+id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @User() user: user_p) {
    return this.cardsService.remove(+id, user);
  }
}
