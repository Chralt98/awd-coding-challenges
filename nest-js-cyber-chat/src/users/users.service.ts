import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.users.create({
      username: dto.username,
      passwordHash: passwordHash,
    });
    return this.users.save(user);
  }

  findByUsername(username: string): Promise<User | null> {
    return this.users.findOneBy({ username });
  }
}
