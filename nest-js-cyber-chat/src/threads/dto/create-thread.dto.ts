import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateThreadDto {
  @ApiProperty({
    description: 'The title of the discussion thread',
    example: 'How does NestJS authentication work?',
    maxLength: 120,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @ApiProperty({
    description: 'The opening message of the thread',
    example:
      'Can someone explain the difference between a guard and a strategy?',
  })
  @IsString()
  @IsNotEmpty()
  body!: string;
}
