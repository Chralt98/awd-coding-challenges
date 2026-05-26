import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Comment } from '../comments/comments.entity';

@Entity('threads')
export class Thread {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  title!: string;

  @Column({ type: 'text' })
  body!: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @Column({ type: 'text' })
  author!: string;

  @OneToMany(() => Comment, (comment) => comment.thread)
  comments!: Comment[];
}
