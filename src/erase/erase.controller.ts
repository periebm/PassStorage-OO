import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EraseService } from './erase.service';
import { ErasePassowordDto } from './dto/erase.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as user_p } from '@prisma/client';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('erase')
export class EraseController {
  constructor(private readonly eraseService: EraseService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete all info' })
  create(@Body() createEraseDto: ErasePassowordDto, @User() user: user_p) {
    return this.eraseService.remove(createEraseDto, user);
  }
}
