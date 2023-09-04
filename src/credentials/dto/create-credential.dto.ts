import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCredentialDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @ApiProperty({ example: 'aaaaaa', description: 'password for credential' })
  password: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @ApiProperty({ example: 'Label 1', description: 'label for credential' })
  label: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @ApiProperty({ example: 'instagram.com', description: 'url of credential' })
  url: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @ApiProperty({ example: 'john', description: 'user of credential' })
  username: string;
}
