import { Injectable } from "@nestjs/common";
import { User } from ".interfaces/user.interface";

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: "1", name: "Alice", email: "alice@example.com" },
    { id: "2", name: "Bob", email: "bob@example.com" },
  ];

  getAllUsers(): User[] {
    return [...this.users];
  }

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  getRandomUser(): User {
    const randomIndex = Math.floor(Math.random() * this.users.length);
    return this.users[randomIndex];
  }

  insertUser(name: string, email: string): User {
    const user: User = { id: Date.now().toString(), name, email };
    this.users.push(user);
    return user;
  }

  updateUser(id: string, name?: string, email?: string): User | undefined {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return undefined;
    }
    if (name !== undefined) {
      this.users[index].name = name;
    }
    if (email !== undefined) {
      this.users[index].email = email;
    }
    return this.users[index];
  }

  deleteUser(id: string): boolean {
    const before = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    return this.users.length < before;
  }
}
