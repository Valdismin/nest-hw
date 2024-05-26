import {Controller, Delete, HttpCode} from "@nestjs/common";
import {Blog, BlogDocument} from "../blogsFeature/blogs.schema";
import {Post, PostDocument} from "../postsFeature/posts.schema";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "../usersFeature/users.schema";
import {Model} from "mongoose";

@Controller('testing/all-data')
export class TestAllController {
    constructor(@InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
                @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
                @InjectModel(User.name) private readonly usersModel: Model<UserDocument>) {
    }

    @Delete()
    @HttpCode(204)
    async clearAll() {
        await this.blogModel.collection.drop()
        await this.postModel.collection.drop()
        await this.usersModel.collection.drop()
    }
}
