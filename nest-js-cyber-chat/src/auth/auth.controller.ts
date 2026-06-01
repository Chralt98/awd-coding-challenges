import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService, type AuthUser } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(
    @Request() req: { user: AuthUser },
    _loginDto: LoginDto,
  ): { access_token: string } {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  me(@Request() req: { user: AuthUser }): AuthUser {
    return req.user;
  }
}
