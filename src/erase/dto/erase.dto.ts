import { IsNotEmpty, IsString } from 'class-validator';

export class ErasePassowordDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}
