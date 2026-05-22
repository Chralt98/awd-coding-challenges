import { Controller, Get } from "@nestjs/common";
import { User } from "./user.interface";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAll(): User[] {
    return this.userService.getAllUsers();
  }

  @Get("random")
  getRandom(): User {
    return this.userService.getRandomUser();
  }
}
