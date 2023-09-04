import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'john@john.com', description: 'username for user' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'aBcd@123', description: 'password for user' })
  password: string;
}
