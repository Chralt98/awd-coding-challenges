import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import bcrypt from 'bcrypt';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

const SALT_ROUNDS = 12;
const POSTGRES_UNIQUE_VIOLATION = '23505';

type PostgresDriverError = {
  code?: string;
  driverError?: { code?: string };
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const userEntity = this.users.create({
      email: dto.email,
      passwordHash,
    });

    const user = await this.users.save(userEntity).catch((err: unknown) => {
      const error = err as PostgresDriverError;
      if (
        error.code === POSTGRES_UNIQUE_VIOLATION ||
        error.driverError?.code === POSTGRES_UNIQUE_VIOLATION
      ) {
        throw new ConflictException('Email already exists');
      }
      throw err;
    });

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
