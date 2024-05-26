import {Body, Controller, Delete, Get, HttpCode, Param, Post, Query} from "@nestjs/common";
import {UsersService} from "./users.service";
import {queryHelper, userMapper} from "../utils";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get()
    async getUsers(@Query() query: any) {
        const sanitizedQuery = queryHelper(query)
        return this.usersService.getUsers(sanitizedQuery);
    }

    @Post()
    async createUser(@Body() user: any) {
        const userId = await this.usersService.createUser(user);
        const createdUser = await this.usersService.getUserById(userId);
        return userMapper(createdUser)
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }
}
