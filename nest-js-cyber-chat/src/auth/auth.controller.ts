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
import { Public } from '../common/decorators/public.decorator';
import { type Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.create(createUserDto);
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(
    @Request() req: ExpressRequest & { user: AuthUser },
    _loginDto: LoginDto,
  ): { access_token: string } {
    return this.authService.login(req.user);
  }

  @Get()
  me(@Request() req: ExpressRequest & { user: AuthUser }): AuthUser {
    return req.user;
  }
}
