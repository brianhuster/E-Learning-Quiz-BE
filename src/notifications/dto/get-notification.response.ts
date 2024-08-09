import { NotificationEntity } from 'src/database/schema/notification/notifications.schema';

export interface GetNotificationResponse {
  notifications: NotificationEntity[];
  total: number;
}
