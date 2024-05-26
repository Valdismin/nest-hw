import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema()
export class User {
  @Prop()
  userInfo: {
    login: {
      type: string,
      required: true
    },
    email: {
      type: string,
      required: true
    },
    hash: string,
    salt: string
  }

  @Prop()
  userConfirmation: {
    confirmed: {
      type: boolean,
      required: true
    },
    confirmCode: {
      type: string,
      required: true
    },
    expirationTime: {
      type: Date,
      required: true
    }
  }

  @Prop()
  createdAt: {
    type: string,
    required: true
  }
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
