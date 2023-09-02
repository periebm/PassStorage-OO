import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import { User } from '@prisma/client';
/* eslint-disable */
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPT_KEY);
@Injectable()
export class CredentialsService {
  constructor(private readonly credentialsRepository: CredentialsRepository) {}

  async create(createCredentialDto: CreateCredentialDto, user: User) {
    await this.findCredentialWithSameName(createCredentialDto, user);
    return await this.credentialsRepository.create(createCredentialDto, user);
  }

  async findAll(user: User) {
    const credentials = await this.credentialsRepository.findAll(user);
    return credentials.map((e) => {
      return {...e, password: cryptr.decrypt(e.password)}
    })
  }

  async findOne(id: number, user: User) {
    const credential = await this.credentialsRepository.findOne(id);
    if (!credential) throw new NotFoundException();
    if (credential.userId !== user.id) throw new ForbiddenException();

    return {...credential, password: cryptr.decrypt(credential.password)};
  }

  async remove(id: number) {
    return `This action removes a #${id} credential`;
  }

  async findCredentialWithSameName(
    createCredentialDto: CreateCredentialDto,
    user: User,
  ) {
    const label = await this.credentialsRepository.findUserLabel(
      createCredentialDto,
      user,
    );

    if (label) throw new ConflictException();
  }
}
