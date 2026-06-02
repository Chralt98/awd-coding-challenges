import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The username of an existing account',
    example: 'Chris',
  })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({
    description: 'The password for the existing account',
    example: 'super-secret-password',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
