import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ObjectId } from 'mongodb';
import { AcceptanceTerms } from '../user/user.entity';

export type CatDocument = HydratedDocument<UserTerms>;
@Schema()
export class UserTerms {
  @Prop()
  _id?: ObjectId;
  @Prop()
  isActive: boolean;
  @Prop()
  userId: string;
  @Prop()
  terms?: AcceptanceTerms;
  @Prop()
  version: number;
  @Prop()
  acceptanceDate: Date;
  @Prop()
  updatedAt: Date;
}

export const UserTermsSchema = SchemaFactory.createForClass(UserTerms);
