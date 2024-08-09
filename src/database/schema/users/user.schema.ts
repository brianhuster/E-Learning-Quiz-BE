import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ROLE } from 'src/config/constants';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class UserEntity {
  @Prop({
    required: true,
  })
  firstName: string;
  @Prop({
    required: true,
  })
  lastName: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  hashedPassword: string;
  @Prop({ required: true, default: ROLE.USER })
  role?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
UserSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });
export type UserDocument = HydratedDocument<UserEntity>;
