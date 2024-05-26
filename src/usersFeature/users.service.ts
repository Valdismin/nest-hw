import {Injectable} from "@nestjs/common";
import {InputUsersType, OutputPaginatedUsersType, UserViewModelType} from "./users.types";
import bcrypt from 'bcrypt'
import {UsersRepository} from "./users.repository";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {
    }

    async getUsers(query: any): Promise<OutputPaginatedUsersType> {
        return this.usersRepository.getUsers(query)
    }

    async createUser(user: InputUsersType) {
        const newUser = {
            createdAt: new Date().toISOString(),
            login: user.login,
            email: user.email,
        }
        return await this.usersRepository.create(newUser)
    }

    async deleteUser(id: string): Promise<void> {
        return await this.usersRepository.deleteUser(id)
    }

    async getUserById(id: string): Promise<UserViewModelType> {
        return await this.usersRepository.getUserById(id)
    }
}
