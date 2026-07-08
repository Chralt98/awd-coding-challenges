import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { vi } from 'vitest';
import request from 'supertest';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';

describe('UsersController (integration)', () => {
  let app: INestApplication;
  const mockUsersRepository = {
    create: vi.fn(),
    save: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockUsersRepository.create.mockImplementation(
      (entity: Partial<User>) => entity,
    );

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector), {
        excludeExtraneousValues: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /register returns 201 with only id and email', async () => {
    mockUsersRepository.save.mockImplementation((entity: Partial<User>) =>
      Promise.resolve({ id: 'user-id', createdAt: new Date(), ...entity }),
    );

    const response = await request(app.getHttpServer())
      .post('/register')
      .send({ email: 'user@example.com', password: 'password1' })
      .expect(201);

    expect(response.body).toEqual({ id: 'user-id', email: 'user@example.com' });
  });

  it('POST /register returns 400 for an invalid body', async () => {
    await request(app.getHttpServer())
      .post('/register')
      .send({ email: 'not-an-email', password: 'short' })
      .expect(400);
  });

  it('POST /register returns 409 for a duplicate email', async () => {
    mockUsersRepository.save.mockRejectedValue({ code: '23505' });

    await request(app.getHttpServer())
      .post('/register')
      .send({ email: 'user@example.com', password: 'password1' })
      .expect(409);
  });
});
