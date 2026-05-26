import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThreadsModule } from './threads/threads.module';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thread } from './threads/threads.entity';
import { Comment } from './comments/comments.entity';

@Module({
  imports: [
    ThreadsModule,
    CommentsModule,
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: './data/db.sqlite',
      entities: [Thread, Comment],
      synchronize: true,
      logging: false,
      enableWAL: true,
      statementCacheSize: 100,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
