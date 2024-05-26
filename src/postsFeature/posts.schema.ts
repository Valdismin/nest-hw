import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { LikeStatus } from "./posts.types";

@Schema()
export class Post {
  @Prop({required: true})
  title: string;
  @Prop({required: true})
  shortDescription: string
  @Prop({required: true})
  content: string
  @Prop({required: true})
  blogId: string
  @Prop({required: true})
  blogName: string
  @Prop()
  createdAt: string
  @Prop()
  likes: {
    likeStatus: LikeStatus,
    userId: string,
    createdAt: string,
    userLogin: string
  }[]

}

export type PostDocument = HydratedDocument<Post>;
export const PostSchema = SchemaFactory.createForClass(Post);
