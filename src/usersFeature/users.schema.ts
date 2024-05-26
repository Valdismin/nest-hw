import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

// @Schema({_id:false})
// class UserInfo {
//   @Prop({required: true})
//   login: string;
//   @Prop({required: true})
//   email: string;
//   @Prop()
//   hash: string;
//   @Prop()
//   salt: string;
// }
//
// @Schema({_id:false})
// class userConfirmation {
//   @Prop({required: true})
//   confirmed: boolean
//   @Prop({required: true})
//   confirmCode: string
//   @Prop({required: true})
//   expirationTime: Date
// }

@Schema()
export class User {
  @Prop({required: true})
  login: string;
  @Prop({required: true})
  email: string;


  @Prop()
  createdAt: string

}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
