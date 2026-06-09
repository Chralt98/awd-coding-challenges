/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Test, TestingModule } from '@nestjs/testing';
import { ThreadsController } from './threads.controller';
import { ThreadsService } from './threads.service';
import { vi } from 'vitest';
import request from 'supertest';
import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Thread } from './threads.entity';
import { CommentsService } from '../comments/comments.service';

const THREAD_ID = '11111111-1111-4111-8111-111111111111';
const MISSING_THREAD_ID = '22222222-2222-4222-8222-222222222222';
const USER_ID = '33333333-3333-4333-8333-333333333333';

const createdAt = new Date('2026-06-02T10:30:00.000Z');

const createThreadDto = {
  title: 'Thread 1',
  body: 'This is the body.',
};

const createdThread = {
  title: 'Thread 1',
  body: 'This is the body.',
  author: 'Alice',
};

const savedThread = {
  id: THREAD_ID,
  title: 'Thread 1',
  body: 'This is the body.',
  author: 'Alice',
  createdAt,
  comments: [],
};

const mockThreadsRepository = {
  create: vi.fn(),
  save: vi.fn(),
  findOne: vi.fn(),
  findOneBy: vi.fn(),
  findAndCount: vi.fn(),
  delete: vi.fn(),
};

class TestAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    req.user = {
      id: USER_ID,
      username: 'Alice',
    };

    return true;
  }
}

describe('ThreadsController integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreadsController],
      providers: [
        ThreadsService,
        {
          provide: getRepositoryToken(Thread),
          useValue: mockThreadsRepository,
        },
        {
          provide: CommentsService,
          useValue: {
            add: vi.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalGuards(new TestAuthGuard());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  beforeEach(() => {
    vi.clearAllMocks();

    mockThreadsRepository.create.mockReturnValue(createdThread);
    mockThreadsRepository.save.mockResolvedValue(savedThread);
    mockThreadsRepository.findOne.mockResolvedValue(savedThread);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /threads returns 201 Created for a valid body', async () => {
    await request(app.getHttpServer())
      .post('/threads')
      .send(createThreadDto)
      .expect(201)
      .expect({
        id: THREAD_ID,
        title: 'Thread 1',
        body: 'This is the body.',
        author: 'Alice',
        createdAt: createdAt.toISOString(),
        comments: [],
      });

    expect(mockThreadsRepository.create).toHaveBeenCalledWith({
      title: 'Thread 1',
      body: 'This is the body.',
      author: 'Alice',
    });

    expect(mockThreadsRepository.save).toHaveBeenCalledWith(createdThread);
  });

  it('POST /threads returns 400 Bad Request when title is missing', async () => {
    await request(app.getHttpServer())
      .post('/threads')
      .send({
        body: 'This is the body.',
      })
      .expect(400);

    expect(mockThreadsRepository.create).not.toHaveBeenCalled();
    expect(mockThreadsRepository.save).not.toHaveBeenCalled();
  });

  it('GET /threads/:id returns 200 OK with the mocked thread payload', async () => {
    await request(app.getHttpServer())
      .get(`/threads/${THREAD_ID}`)
      .expect(200)
      .expect({
        id: THREAD_ID,
        title: 'Thread 1',
        body: 'This is the body.',
        author: 'Alice',
        createdAt: createdAt.toISOString(),
        comments: [],
      });

    expect(mockThreadsRepository.findOne).toHaveBeenCalledWith({
      where: { id: THREAD_ID },
      relations: { comments: { thread: true } },
    });
  });

  it('GET /threads/:id returns 404 Not Found when the thread does not exist', async () => {
    mockThreadsRepository.findOne.mockResolvedValueOnce(null);

    await request(app.getHttpServer())
      .get(`/threads/${MISSING_THREAD_ID}`)
      .expect(404);

    expect(mockThreadsRepository.findOne).toHaveBeenCalledWith({
      where: { id: MISSING_THREAD_ID },
      relations: { comments: { thread: true } },
    });
  });
});
