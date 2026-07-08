import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('has no validation errors for a valid email and password', async () => {
    const dto = plainToInstance(CreateUserDto, {
      email: 'user@example.com',
      password: 'password1',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('rejects an invalid email', async () => {
    const dto = plainToInstance(CreateUserDto, {
      email: 'not-an-email',
      password: 'password1',
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'email')).toBe(true);
  });

  it('rejects a password shorter than 8 characters', async () => {
    const dto = plainToInstance(CreateUserDto, {
      email: 'user@example.com',
      password: 'short',
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'password')).toBe(true);
  });
});
