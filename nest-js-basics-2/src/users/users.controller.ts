import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  NotFoundException,
} from "@nestjs/common";
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
  getById(@Param("id") id: string): User {
    console.log(id); // id = "42" for GET /users/42
    const user = this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Get()
  searchUsers(@Query("search") search: string): User[] {
    console.log(search); // search = "alice" for GET /users?search=alice
    return [];
  }

  @Post()
  create(@Body() body: UserPayload): User {
    return this.userService.insertUser(body.name, body.email);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: Partial<UserPayload>): User {
    const updated = this.userService.updateUser(id, body.name, body.email);
    if (!updated) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updated;
  }

  @Delete(":id")
  remove(@Param("id") id: string): { message: string } {
    const deleted = this.userService.deleteUser(id);
    if (!deleted) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { message: `User with id ${id} deleted successfully` };
  }
}
