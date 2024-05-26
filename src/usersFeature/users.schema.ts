import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema()
export class User {
  @Prop()
  userInfo: {
    login: string,
    email: string,
    hash: string,
    salt: string
  }

  @Prop()
  userConfirmation: {
    confirmed: boolean,
    confirmCode: string,
    expirationTime: Date
    }


  @Prop()
  createdAt: string

}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
