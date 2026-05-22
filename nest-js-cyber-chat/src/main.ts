import { Module, Injectable, Get, Controller } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";

@Injectable()
class AppService {
  generateMessage(): string {
    return "Hello World";
  }
}

@Controller()
class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  showHello() {
    return this.appService.generateMessage();
  }
}

@Module({
  imports: [UsersModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3232);
  console.log(`Server is running on port ${await app.getUrl()}`);
}

bootstrap();
