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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create note' })
  create(@Body() createNoteDto: CreateNoteDto, @User() user: user_p) {
    return this.notesService.create(createNoteDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notes' })
  findAll(@User() user: user_p) {
    return this.notesService.findAll(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'note id', example: '1' })
  @ApiOperation({ summary: 'Get one note' })
  findOne(@Param('id') id: string, @User() user: user_p) {
    return this.notesService.findOne(+id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'note id', example: '1' })
  @ApiOperation({ summary: 'Delete one note' })
  remove(@Param('id') id: string, @User() user: user_p) {
    return this.notesService.remove(+id, user);
  }
}
