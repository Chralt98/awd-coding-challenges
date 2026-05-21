import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

@Module({
  controllers: [],
  providers: [],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3232);
  console.log(`Server is running on port ${await app.getUrl()}`);
}

bootstrap();
