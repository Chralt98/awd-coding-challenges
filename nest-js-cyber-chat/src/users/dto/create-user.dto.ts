import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The unique username for the new account',
    example: 'Chris',
    maxLength: 80,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  username!: string;

  @ApiProperty({
    description: 'The password for the new account',
    example: 'super-secret-password',
    maxLength: 120,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  password!: string;
}
