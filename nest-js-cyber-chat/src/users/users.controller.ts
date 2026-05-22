import { Controller, Get, Param, Post, Body, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./user.interface";
import { UserPayload } from "./user-payload.interface";

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

  @Get(":id")
  getById(@Param("id") userId: string): User {
    console.log(userId); // id = "42" for GET /users/42
  }

  @Post()
  createUser(@Body() user: UserPayload): User {
    return this.userService.createUser(user);
  }

  @Get()
  searchUsers(@Query("search") search: string): User[] {
    console.log(search); // search = "alice" for GET /users?search=alice
    return [];
  }
}
