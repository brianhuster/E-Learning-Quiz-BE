import { Injectable } from '@nestjs/common';
import { ReportQuestionRequest } from './dto/report-question.request';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationEntity } from 'src/database/schema/notification/notifications.schema';
import mongoose, { Model } from 'mongoose';
import { NOTIFICATION_TYPE } from 'src/config/constants';
import { GetNotificationResponse } from './dto/get-notification.response';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NotificationEntity.name)
    private readonly notificationModel: Model<NotificationEntity>,
  ) {}

  async reportQuestion(
    userId: string,
    { questionId, message }: ReportQuestionRequest,
  ): Promise<void> {
    const notification = new this.notificationModel({
      title: `Reported Question ${questionId}`,
      message: message,
      type: NOTIFICATION_TYPE.REPORT_QUESTION,
      userId: new mongoose.Types.ObjectId(userId),
      forAdmin: true,
    });
    await notification.save();
  }

  async remindQuestion(userId: string, sheetId: string): Promise<void> {
    const notification = new this.notificationModel({
      title: 'Nhắc lại một số dạng',
      message: sheetId,
      type: NOTIFICATION_TYPE.REMIND_QUESTION,
      userId: new mongoose.Types.ObjectId(userId),
      forAdmin: false,
    });
    await notification.save();
  }
  async findAll(userId: string): Promise<GetNotificationResponse> {
    const notifications = await this.notificationModel.find({ userId }).lean();
    return {
      notifications,
      total: notifications.length,
    };
  }
  async makeRead(id: string): Promise<void> {
    await this.notificationModel.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { isRead: true },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  // update(id: number, updateReportDto: UpdateReportDto) {
  //   return `This action updates a #${id} report`;
  // }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
