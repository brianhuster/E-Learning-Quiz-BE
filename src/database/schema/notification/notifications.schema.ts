import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaType, SchemaTypes } from 'mongoose';
import { UserEntity } from '../users/user.schema';

@Schema({ collection: 'notifications' })
export class NotificationEntity {
  @Prop({
    required: true,
  })
  title: string;
  @Prop({
    required: true,
  })
  message: string;
  @Prop({
    required: true,
    index: true,
  })
  type: number;
  @Prop({
    required: true,
    default: false,
  })
  isRead: boolean;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: UserEntity.name,
    index: true,
  })
  userId: UserEntity;
  @Prop({
    required: true,
    default: false,
    index: true,
  })
  forAdmin: boolean;
}

export const NotificationSchema =
  SchemaFactory.createForClass(NotificationEntity);
export type NotificationDocument = HydratedDocument<NotificationEntity>;
