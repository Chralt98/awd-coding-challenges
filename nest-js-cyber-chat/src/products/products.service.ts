import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Injectable()
export class ProductsService {
  constructor(private readonly usersService: UsersService) {}

  getProductsWithOwners() {
    const users = this.usersService.getAllUsers();
    // ... business logic
  }
}
