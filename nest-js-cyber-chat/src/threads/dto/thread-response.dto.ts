import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CommentResponseDto } from '../../comments/dto/comment-response.dto';

export class ThreadResponseDto {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier of the thread',
    example: '3f3d78c0-9a0a-4e6f-bab8-a19e80d5b1c7',
    format: 'uuid',
  })
  id!: string;

  @Expose()
  @ApiProperty({
    description: 'The title of the thread',
    example: 'How does NestJS authentication work?',
  })
  title!: string;

  @Expose()
  @ApiProperty({
    description: 'The full content of the thread',
    example:
      'Can someone explain the difference between a guard and a strategy?',
  })
  body!: string;

  @Expose()
  @Type(() => Date)
  @ApiProperty({
    description: 'When the thread was created',
    example: '2026-06-02T10:30:00.000Z',
    format: 'date-time',
  })
  createdAt!: Date;

  @Expose()
  @ApiProperty({
    description: 'The username of the thread author',
    example: 'Chris',
  })
  author!: string;

  @Expose()
  @Type(() => CommentResponseDto)
  @ApiProperty({
    description: 'The comments that belong to the thread',
    type: () => [CommentResponseDto],
  })
  comments!: CommentResponseDto[];
}
