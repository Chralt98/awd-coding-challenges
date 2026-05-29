import { Exclude, Expose, Type } from 'class-transformer';

export class CreateUserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  username!: string;

  @Exclude()
  passwordHash!: string;

  @Expose()
  @Type(() => Date)
  createdAt!: Date;
}
