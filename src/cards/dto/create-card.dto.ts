import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: '1234 5678 9012 3456', description: 'card number' })
  number: number;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @ApiProperty({ example: 'John Doe', description: 'name on the card' })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: '123', description: 'card code' })
  code: number;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @ApiProperty({ example: '05/28', description: 'expiration date' })
  date: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @ApiProperty({ example: '1234', description: 'card password' })
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: 'true', description: 'if is a virtual card or not' })
  is_virtual: boolean;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @ApiProperty({
    example: 'both',
    description: 'if is it credit, debit or both',
  })
  payment: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @ApiProperty({
    example: 'First Card',
    description: 'label for differentiate cards',
  })
  label: string;
}
