import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;


@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, unique: true })
  firstName: string;

  @Prop({ required: true, unique: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  college: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
