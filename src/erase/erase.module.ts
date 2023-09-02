import { Module } from '@nestjs/common';
import { EraseService } from './erase.service';
import { EraseController } from './erase.controller';
import { UsersModule } from '../users/users.module';
import { CardsModule } from '../cards/cards.module';
import { CredentialsModule } from '../credentials/credentials.module';
import { NotesModule } from '../notes/notes.module';

@Module({
  imports: [UsersModule, CardsModule, CredentialsModule, NotesModule],
  controllers: [EraseController],
  providers: [EraseService],
})
export class EraseModule {}
