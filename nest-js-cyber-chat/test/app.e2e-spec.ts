/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

const USER_ID = '33333333-3333-4333-8333-333333333333';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let jwtService: JwtService;
  let accessToken: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    jwtService = module.get<JwtService>(JwtService);

    accessToken = jwtService.sign({
      sub: USER_ID,
      id: USER_ID,
      username: 'Alice',
    });

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('creates a thread, adds a comment, and fetches the thread with its comment', async () => {
    const createThreadResponse = await request(app.getHttpServer())
      .post('/threads')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'E2E Thread',
        body: 'This thread was created during an E2E test.',
      })
      .expect(201);

    expect(createThreadResponse.body).toMatchObject({
      id: expect.any(String),
      title: 'E2E Thread',
      body: 'This thread was created during an E2E test.',
      author: 'Alice',
      createdAt: expect.any(String),
    });

    const threadId = createThreadResponse.body.id;

    const createCommentResponse = await request(app.getHttpServer())
      .post(`/threads/${threadId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        body: 'This comment was created during an E2E test.',
      })
      .expect(201);

    expect(createCommentResponse.body).toMatchObject({
      id: expect.any(String),
      threadId,
      body: 'This comment was created during an E2E test.',
      author: 'Alice',
      createdAt: expect.any(String),
    });

    const commentId = createCommentResponse.body.id;

    const getThreadResponse = await request(app.getHttpServer())
      .get(`/threads/${threadId}`)
      .expect(200);

    expect(getThreadResponse.body).toMatchObject({
      id: threadId,
      title: 'E2E Thread',
      body: 'This thread was created during an E2E test.',
      author: 'Alice',
      createdAt: expect.any(String),
      comments: [
        {
          id: commentId,
          threadId,
          body: 'This comment was created during an E2E test.',
          author: 'Alice',
          createdAt: expect.any(String),
        },
      ],
    });
  });

  it('returns 404 when fetching a thread that does not exist', async () => {
    const missingThreadId = '99999999-9999-4999-8999-999999999999';

    await request(app.getHttpServer())
      .get(`/threads/${missingThreadId}`)
      .expect(404);
  });
});
