import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CommentResponseDto {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier of the comment',
    example: '8f31bc15-8e44-4477-ac5f-2efb0a64c2e1',
    format: 'uuid',
  })
  id!: string;

  @Expose()
  @ApiProperty({
    description: 'The unique identifier of the thread the comment belongs to',
    example: '3f3d78c0-9a0a-4e6f-bab8-a19e80d5b1c7',
    format: 'uuid',
  })
  threadId!: string;

  @Expose()
  @ApiProperty({
    description: 'The content of the comment',
    example: 'A guard decides whether the request may continue.',
  })
  body!: string;

  @Expose()
  @ApiProperty({
    description: 'The username of the comment author',
    example: 'Chris',
  })
  author!: string;

  @Expose()
  @Type(() => Date)
  @ApiProperty({
    description: 'When the comment was created',
    example: '2026-06-02T10:35:00.000Z',
    format: 'date-time',
  })
  createdAt!: Date;
}
