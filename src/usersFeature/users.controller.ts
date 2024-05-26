import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { queryHelper } from "../utils";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query() query: any) {
    const sanitizedQuery = queryHelper(query)
    return this.usersService.getUsers(sanitizedQuery);
  }

  @Post()
  async createUser(@Body() user: any) {
    const userId = await this.usersService.createUser(user);

    return this.usersService.getUserById(userId);
  }

  @Delete()
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
