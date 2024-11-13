import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Policy } from '../policy/policy.entity';

export type CatDocument = HydratedDocument<UserTerms>;
@Schema()
export class UserTerms {
  @Prop()
  id?: string;
  @Prop()
  isActive: boolean;
  @Prop()
  userId: number;
  @Prop()
  terms: Policy[];
  @Prop()
  version: number;
  @Prop()
  acceptanceDate: Date;
  @Prop()
  updatedAt: Date;
}

export const UserTermsSchema = SchemaFactory.createForClass(UserTerms);
