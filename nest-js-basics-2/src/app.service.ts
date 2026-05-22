import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  generateMessage(): string {
    return "Hello World";
  }
}
