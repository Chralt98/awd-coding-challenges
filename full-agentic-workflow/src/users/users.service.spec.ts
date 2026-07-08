import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { vi } from 'vitest';
import bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  const mockUsersRepository = {
    create: vi.fn(),
    save: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  const dto: CreateUserDto = { email: 'user@example.com', password: 'password1' };

  it('hashes the password before saving, never the plaintext', async () => {
    mockUsersRepository.create.mockImplementation((entity: Partial<User>) => entity);
    mockUsersRepository.save.mockImplementation((entity: User) =>
      Promise.resolve({ id: 'user-id', createdAt: new Date(), ...entity }),
    );

    await service.create(dto);

    const savedEntity = mockUsersRepository.create.mock.calls[0][0] as {
      passwordHash: string;
    };
    expect(savedEntity.passwordHash).not.toBe(dto.password);
    await expect(
      bcrypt.compare(dto.password, savedEntity.passwordHash),
    ).resolves.toBe(true);
  });

  it('returns only the public fields, never the password hash', async () => {
    mockUsersRepository.create.mockImplementation((entity: Partial<User>) => entity);
    mockUsersRepository.save.mockImplementation((entity: User) =>
      Promise.resolve({ id: 'user-id', createdAt: new Date(), ...entity }),
    );

    const result = await service.create(dto);

    expect(result).toEqual({ id: 'user-id', email: dto.email });
    expect((result as Partial<User>).passwordHash).toBeUndefined();
  });

  it('throws ConflictException when the email already exists (Postgres 23505)', async () => {
    mockUsersRepository.create.mockImplementation((entity: Partial<User>) => entity);
    mockUsersRepository.save.mockRejectedValue({ code: '23505' });

    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
  });

  it('rethrows errors unrelated to a duplicate email', async () => {
    mockUsersRepository.create.mockImplementation((entity: Partial<User>) => entity);
    const unrelatedError = new Error('connection lost');
    mockUsersRepository.save.mockRejectedValue(unrelatedError);

    await expect(service.create(dto)).rejects.toThrow(unrelatedError);
  });
});
