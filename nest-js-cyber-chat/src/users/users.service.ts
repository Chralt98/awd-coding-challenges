import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/user-response.dto';

type SqliteConstraintError = {
  code?: string;
  driverError?: {
    code?: string;
  };
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const userEntity = this.users.create({
      username: dto.username,
      passwordHash: passwordHash,
    });
    const user = await this.users.save(userEntity).catch((err: unknown) => {
      const error = err as SqliteConstraintError;

      if (
        error.code === 'SQLITE_CONSTRAINT_UNIQUE' ||
        error.driverError?.code === 'SQLITE_CONSTRAINT_UNIQUE'
      ) {
        throw new ConflictException('Username already exists');
      }

      throw err;
    });
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.users.findOneBy({ username });
    return user;
  }
}
