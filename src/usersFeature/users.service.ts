import { Injectable } from "@nestjs/common";
import {InputUsersType, OutputPaginatedUsersType, UserViewModelType} from "./users.types";
import bcrypt from 'bcrypt'
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {
  }

  async getUsers(query: any): Promise<OutputPaginatedUsersType> {
    return this.usersRepository.getUsers(query)
  }

  async createUser(user: InputUsersType) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(user.password, salt)
    const newUser = {
      createdAt: new Date().toISOString(),
      userInfo: {
        login: user.login,
        email: user.email,
        hash: hashedPassword,
        salt: salt,
      },
      userConfirmation: {
        confirmed: true,
        confirmCode: 'unusedCode',
        expirationTime: new Date(Date.now() + 1000 * 60 * 60 * 24)
      }
    }
    return await this.usersRepository.create(newUser)
  }

  async deleteUser(id: string): Promise<void>{
    return await this.usersRepository.deleteUser(id)
  }

  async getUserById(id: string): Promise<UserViewModelType> {
    return await this.usersRepository.getUserById(id)
  }
}
