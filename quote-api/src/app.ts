import {
  Controller,
  Get,
  Injectable,
  Module,
  Param,
  Post,
} from "@nestjs/common";
import { quotes, type Quote } from "./db/data";
import { NestFactory } from "@nestjs/core";

function getRandomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

@Injectable()
class QuoteService {
  private quotes = quotes;

  getAll(): Quote[] {
    return this.quotes;
  }

  getRandom(): Quote {
    const randomIndex = getRandomIndex(this.quotes.length);
    const randomQuote = this.quotes.at(randomIndex)!;
    return randomQuote;
  }
}

@Controller("quotes")
class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Get("/")
  getAllQuotes(): Quote[] {
    return this.quoteService.getAll();
  }

  @Get("random")
  getRandomQuote(): Quote {
    return this.quoteService.getRandom();
  }
}

@Module({
  controllers: [QuoteController],
  providers: [QuoteService],
})
class QuoteModule {}

@Module({
  imports: [QuoteModule],
  controllers: [],
  providers: [],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log("App running on " + (await app.getUrl()));
}

bootstrap();
