import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema()
export class Blog {
  @Prop({required: true})
  name: string;
  @Prop({required: true})
  description: string
  @Prop({required: true})
  websiteUrl: string
  @Prop()
  createdAt: string
  @Prop()
  isMembership: boolean
}

export type BlogDocument = HydratedDocument<Blog>;
export const BlogSchema = SchemaFactory.createForClass(Blog);
