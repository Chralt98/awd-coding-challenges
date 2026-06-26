import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PollService } from './poll.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class PollGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly pollService: PollService) {}

  @SubscribeMessage('vote')
  handleVote(@MessageBody() option: string) {
    const results = this.pollService.addVote(option);
    this.server.emit('results', results);
  }

  @SubscribeMessage('joinPoll')
  async handleJoin(
    @MessageBody() pollId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    await socket.join(pollId);
    this.server.to(pollId).emit('results', this.pollService.getResults());
  }

  @SubscribeMessage('voteWithRoom')
  handleVoteWithRoom(@MessageBody() data: { pollId: string; option: string }) {
    const results = this.pollService.addVoteWithRoom(data.pollId, data.option);
    this.server.to(data.pollId).emit('results', results);
  }
}
