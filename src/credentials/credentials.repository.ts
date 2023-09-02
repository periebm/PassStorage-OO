import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { User } from '@prisma/client';

/* eslint-disable */
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPT_KEY);

@Injectable()
export class CredentialsRepository {

  constructor(private readonly prisma: PrismaService) {}
  private SALT = 10;

  create(body: CreateCredentialDto, user: User) {
    return this.prisma.credential.create({
      data: {
        ...body,
        userId: user.id,
        password: cryptr.encrypt(body.password),
      },
    });
  }

  findUserLabel(body: CreateCredentialDto, user: User) {
    return this.prisma.credential.findFirst({
      where: {
        AND: [
          { userId: user.id },
          { label: body.label },
        ],
      },
    });
  }

  async findAll(user: User) {
    const credentials = await this.prisma.credential.findMany( {where: {userId: user.id}})
    return credentials;
  }

  async findOne(id: number) {
    const theOne = await this.prisma.credential.findFirst({
      where: { id },
    })

    return theOne;
  }

  remove(id: number) {
    return this.prisma.credential.delete({
      where: { id },
    });
  }
}
