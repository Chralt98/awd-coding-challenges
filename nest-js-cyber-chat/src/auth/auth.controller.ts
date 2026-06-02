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
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ description: 'User registered successfully' })
  @ApiConflictResponse({ description: 'Username already exists' })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.create(createUserDto);
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login and receive a JWT access token' })
  @ApiOkResponse({ description: 'Login successful, returns access token' })
  @ApiUnauthorizedResponse({ description: 'Invalid username or password' })
  login(
    @Request() req: ExpressRequest & { user: AuthUser },
    @Body() _loginDto: LoginDto,
  ): { access_token: string } {
    return this.authService.login(req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get the currently authenticated user' })
  @ApiOkResponse({ description: 'Returns the currently authenticated user' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  me(@Request() req: ExpressRequest & { user: AuthUser }): AuthUser {
    return req.user;
  }
}
