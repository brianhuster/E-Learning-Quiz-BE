import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ReportController } from './notification.controller';

@Module({
  controllers: [ReportController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
