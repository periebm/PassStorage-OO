import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { User } from '@prisma/client';
import { NotesRepository } from './notes.repository';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  async create(createNoteDto: CreateNoteDto, user: User) {
    await this.findNoteWithSameName(createNoteDto, user);
    return await this.notesRepository.create(createNoteDto, user);
  }

  async findAll(user: User) {
    const notes = await this.notesRepository.findAll(user);
    return notes;
  }

  async findOne(id: number, user: User) {
    const note = await this.notesRepository.findOne(id);
    if (!note) throw new NotFoundException();
    if (note.userId !== user.id) throw new ForbiddenException();

    return note;
  }

  async remove(id: number, user: User) {
    const note = await this.notesRepository.findOne(id);
    if (!note) throw new NotFoundException();
    if (note.userId !== user.id) throw new ForbiddenException();

    return await this.notesRepository.remove(id);
  }

  async removeAll(user: User) {
    return await this.notesRepository.removeAll(user);
  }

  async findNoteWithSameName(createNoteDto: CreateNoteDto, user: User) {
    const title = await this.notesRepository.findUserLabel(createNoteDto, user);
    if (title) throw new ConflictException();
  }
}
