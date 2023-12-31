import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import CreateUserDto from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(userDto: CreateUserDto) {
    const { email } = userDto;
    const user = await this.usersRepository.getUserByEmail(email);
    if (user) throw new ConflictException('Email already in use.');

    return await this.usersRepository.create(userDto);
  }

  async getById(id: number) {
    const user = await this.usersRepository.getById(id);
    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.getUserByEmail(email);
  }

  async remove(id: number) {
    return await this.usersRepository.remove(id);
  }
}
