import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";
import {LikeStatus} from "./posts.types";

@Schema({_id: false})
class Likes {
    @Prop({required: true})
    likeStatus: LikeStatus;
    @Prop({required: true})
    userId: string;
    @Prop({
        required: true, default: Date.now
    })
    createdAt: string;
    @Prop({required: true})
    userLogin: string;
}


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
    @Prop({
        type: [Likes]
    })
    likes: Likes[]
}

export type PostDocument = HydratedDocument<Post>;
export const PostSchema = SchemaFactory.createForClass(Post);
