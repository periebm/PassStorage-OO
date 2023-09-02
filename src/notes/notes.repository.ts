import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(body: CreateNoteDto, user: User) {
    return this.prisma.notes.create({
      data: {
        ...body,
        userId: user.id,
      },
    });
  }

  findUserLabel(body: CreateNoteDto, user: User) {
    return this.prisma.notes.findFirst({
      where: {
        AND: [{ userId: user.id }, { title: body.title }],
      },
    });
  }

  async findAll(user: User) {
    const notes = await this.prisma.notes.findMany({
      where: { userId: user.id },
    });
    return notes;
  }

  async findOne(id: number) {
    const theOne = await this.prisma.notes.findFirst({
      where: { id },
    });

    return theOne;
  }

  remove(id: number) {
    return this.prisma.notes.delete({
      where: { id },
    });
  }

  removeAll(user: User) {
    return this.prisma.notes.deleteMany({
      where: { userId: user.id },
    });
  }
}
