import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PollService } from './poll.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class PollGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly pollService: PollService) {}

  @SubscribeMessage('vote')
  handleVote(@MessageBody() option: string) {
    const results = this.pollService.addVote(option);
    this.server.emit('results', results);
  }
}
