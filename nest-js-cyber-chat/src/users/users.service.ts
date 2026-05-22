import { Injectable } from "@nestjs/common";
import { UserRepository } from "./users.repository";
import { User } from ".interfaces/user.interface";

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly sessionRepository: SessionRepository,
  )

  getAllUsers(): User[] {
    return this.userRepository.findAll();
  }

  getUserById(id: string): User | undefined {
    return this.userRepository.findById(id);
  }

  getRandomUser(): User {
    return this.userRepository.getRandom();
  }

  insertUser(name: string, email: string): User {
    if (!name || name.trim().length < 2) {
        throw new ValidationError("Name must be at least 2 characters");
    }

    if (!isValidEmail(email)) {
        throw new ValidationError("Invalid email format");
    }

    const existing = this.userRepository.findByEmail(email);
    if (existing) {
        throw new ConflictError(`User with email ${email} already exists`);
    }

    return this.userRepository.create({ name, email });
  }

  updateUser(id: string, name?: string, email?: string): User | undefined {
    if (name && name.trim().length < 2) {
        throw new ValidationError("Invalid name format");
    }

    if (email && !isValidEmail(email)) {
        throw new ValidationError("Invalid email format");
    }

    return this.userRepository.update(id, { name, email });
  }

  deleteUser(id: string): boolean {
    this.postRepository.deleteByAuthor(id);
    this.sessionRepository.deleteByUser(id);
    return this.userRepository.delete(id);
  }
}
