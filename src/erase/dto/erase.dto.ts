import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ErasePassowordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'aBcd@123', description: 'password for user' })
  password: string;
}
