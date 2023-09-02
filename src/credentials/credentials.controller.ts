import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as user_p } from '@prisma/client';

@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createCredentialDto: CreateCredentialDto,
    @User() user: user_p,
  ) {
    return this.credentialsService.create(createCredentialDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@User() user: user_p) {
    return this.credentialsService.findAll(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @User() user: user_p) {
    return this.credentialsService.findOne(+id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @User() user: user_p) {
    return this.credentialsService.remove(+id, user);
  }
}
