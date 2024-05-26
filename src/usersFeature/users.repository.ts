import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./users.schema";
import {OutputPaginatedUsersType, UsersDBType, UserViewModelType} from "./users.types";

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async create(user: any): Promise<string> {
    const newUser = new this.userModel(user);
    await newUser.save();
    return newUser._id.toString();
  }

  async getUsers(query: any): Promise<OutputPaginatedUsersType> {
      const searchConditions:{ [key: string]: RegExp }[] = [];

      if (query.searchLoginTerm) {
        const searchLoginRegex = new RegExp(query.searchLoginTerm, 'i');
        searchConditions.push({'userInfo.login': searchLoginRegex});
      }

      if (query.searchEmailTerm) {
        const searchEmailRegex = new RegExp(query.searchEmailTerm, 'i');
        searchConditions.push({'userInfo.email': searchEmailRegex});
      }

      const findQuery = searchConditions.length ? {$or: searchConditions} : {};

      try {
        const items: any = await this.userModel.find(findQuery).sort({[query.sortBy]: query.sortDirection})
          .skip((query.pageNumber - 1) * query.pageSize)
          .limit(query.pageSize)

        let mappedItems = items.map((item: UsersDBType) => {
          return {
            id: item._id,
            userInfo: item.userInfo,
            userConfirmation: item.userConfirmation,
            createdAt: item.createdAt
          }
        })

        const c = await this.userModel.countDocuments(findQuery).exec();

        return {
          items:mappedItems,
          totalCount: c,
          pagesCount: Math.ceil(c / query.pageSize),
          page: query.pageNumber,
          pageSize: query.pageSize
        }
      } catch (e) {
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }

  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({_id: id}).exec()

    if (result.deletedCount === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return
  }

  async getUserById(id: string): Promise<UserViewModelType> {
    const user = await this.userModel.findOne({_id: id}).exec()

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      id: user._id.toString(),
      userInfo: user.userInfo,
      userConfirmation: user.userConfirmation,
      createdAt: user.createdAt
    }
  }
}
