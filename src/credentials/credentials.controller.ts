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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('credentials')
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create credential' })
  create(
    @Body() createCredentialDto: CreateCredentialDto,
    @User() user: user_p,
  ) {
    return this.credentialsService.create(createCredentialDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all credentials' })
  findAll(@User() user: user_p) {
    return this.credentialsService.findAll(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'credential id', example: '1' })
  @ApiOperation({ summary: 'Get one credential' })
  findOne(@Param('id') id: string, @User() user: user_p) {
    return this.credentialsService.findOne(+id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'credential id', example: '1' })
  @ApiOperation({ summary: 'Delete one credential' })
  remove(@Param('id') id: string, @User() user: user_p) {
    return this.credentialsService.remove(+id, user);
  }
}
