import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type AcceptanceTermDocument = HydratedDocument<AcceptanceTerm>;
@Schema()
export class AcceptanceTerm {
  @Prop()
  _id: ObjectId;
  @Prop()
  version: number;
  @Prop()
  isActive: boolean;
  @Prop()
  description?: string;
  @Prop()
  items: AcceptanceTermItem[];
  @Prop()
  createdAt: Date;
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

export const AcceptanceTermSchema =
  SchemaFactory.createForClass(AcceptanceTerm);
