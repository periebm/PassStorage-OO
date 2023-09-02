import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ErasePassowordDto } from './dto/erase.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CredentialsService } from '../credentials/credentials.service';
import { CardsService } from '../cards/cards.service';
import { UsersService } from '../users/users.service';
import { NotesService } from '../notes/notes.service';

@Injectable()
export class EraseService {
  constructor(
    private readonly user: UsersService,
    private readonly card: CardsService,
    private readonly credential: CredentialsService,
    private readonly note: NotesService,
  ) {}

  async remove(createEraseDto: ErasePassowordDto, user: User) {
    const valid = await bcrypt.compare(createEraseDto.password, user.password);
    if (!valid) throw new UnauthorizedException('Password not valid.');
    await this.note.removeAll(user);
    await this.credential.removeAll(user);
    await this.card.removeAll(user);
    await this.user.remove(user.id);

    return `User and user infos deleted`;
  }
}
