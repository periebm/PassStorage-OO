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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('cards')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create card' })
  create(@Body() createCardDto: CreateCardDto, @User() user: user_p) {
    return this.cardsService.create(createCardDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all cards' })
  findAll(@User() user: user_p) {
    return this.cardsService.findAll(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'card id', example: '1' })
  @ApiOperation({ summary: 'Get one card' })
  findOne(@Param('id') id: string, @User() user: user_p) {
    return this.cardsService.findOne(+id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'note id', example: '1' })
  @ApiOperation({ summary: 'Delete one card' })
  remove(@Param('id') id: string, @User() user: user_p) {
    return this.cardsService.remove(+id, user);
  }
}
