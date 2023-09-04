import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export default class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'john@john.com', description: 'username for user' })
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty({ example: 'aBcd@123', description: 'password for user' })
  password: string;
}
