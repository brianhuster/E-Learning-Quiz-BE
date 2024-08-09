import { Controller, Post } from '@nestjs/common';
import { RememberService } from './remember.service';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly rememberService: RememberService) {}

  @Post('remind-question')
  async remindQuestion() {
    return this.rememberService.remindQuestion();
  }
}
