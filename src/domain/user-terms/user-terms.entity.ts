import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AcceptanceTerm } from '../acceptance-terms/acceptance-term.entity';
import { ObjectId } from 'mongodb';

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
  terms: AcceptanceTerm[];
  @Prop()
  version: number;
  @Prop()
  acceptanceDate: Date;
  @Prop()
  updatedAt: Date;
}

export const UserTermsSchema = SchemaFactory.createForClass(UserTerms);