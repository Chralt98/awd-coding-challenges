import { Injectable } from '@nestjs/common';

@Injectable()
export class PollService {
  private tallies: Record<string, number> = {};

  addVote(option: string) {
    this.tallies[option] = (this.tallies[option] ?? 0) + 1;
    return this.tallies;
  }
}
