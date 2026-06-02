import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 'd1eb2356-e1a4-4952-8147-84c6289eb26e',
    format: 'uuid',
  })
  id!: string;

  @Expose()
  @ApiProperty({
    description: 'The username of the user',
    example: 'Chris',
  })
  username!: string;

  @Exclude()
  passwordHash!: string;

  @Expose()
  @Type(() => Date)
  @ApiProperty({
    description: 'When the user account was created',
    example: '2026-06-02T10:30:00.000Z',
    format: 'date-time',
  })
  createdAt!: Date;
}
