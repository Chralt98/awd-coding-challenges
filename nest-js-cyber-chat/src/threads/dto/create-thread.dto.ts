import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateThreadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @IsString()
  @IsNotEmpty()
  body!: string;
}
