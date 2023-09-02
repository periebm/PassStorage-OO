import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { User } from '../decorators/user.decorator';
import { User as user_p } from '@prisma/client';
import { AuthGuard } from '../guards/auth.guard';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createNoteDto: CreateNoteDto, @User() user: user_p) {
    return this.notesService.create(createNoteDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@User() user: user_p) {
    return this.notesService.findAll(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @User() user: user_p) {
    return this.notesService.findOne(+id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @User() user: user_p) {
    return this.notesService.remove(+id, user);
  }
}
