import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.entity';
import * as bcrypt from 'bcrypt';

export type AuthUser = Pick<User, 'id' | 'username'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<AuthUser | null> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return {
        id: user.id,
        username: user.username,
      };
    }
    return null;
  }

  login(user: AuthUser): { access_token: string } {
    const payload = {
      id: user.id,
      username: user.username,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
