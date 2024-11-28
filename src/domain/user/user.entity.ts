import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop()
  _id: ObjectId;
  @Prop()
  username: string;
  @Prop()
  password: string;
  @Prop()
  email: string;
  @Prop()
  consentStatus: boolean;
  @Prop()
  acceptanceTerms?: AcceptanceTerms[];
  @Prop()
  consentDate: Date;
  @Prop()
  cnpj: string;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

@Schema()
export class AcceptanceTerms {
  @Prop()
  _id: string;
  @Prop()
  version: number;
  @Prop()
  description?: string;
  @Prop()
  items: AcceptanceTermItem[];
  @Prop()
  createdAt: Date;
  @Prop()
  restrictions: string[];
}

@Schema()
export class AcceptanceTermItem {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  tag: string;
  @Prop()
  isMandatory: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
