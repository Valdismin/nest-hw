import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {Blog, BlogSchema} from "./blogsFeature/blogs.schema";
import {BlogsController} from "./blogsFeature/blogs.controller";
import {BlogsService} from "./blogsFeature/blogs.service";
import {BlogsRepository} from "./blogsFeature/blogs.repository";
import {PostsService} from "./postsFeature/posts.service";
import {PostsRepository} from "./postsFeature/posts.repository";
import {PostsController} from "./postsFeature/posts.controller";
import {Post, PostSchema} from "./postsFeature/posts.schema";
import {User, UserSchema} from "./usersFeature/users.schema";
import {UsersController} from "./usersFeature/users.controller";
import {UsersService} from "./usersFeature/users.service";
import {UsersRepository} from "./usersFeature/users.repository";
import {TestAllController} from "./testAllFeature/testAll.controller";

@Module({
    imports: [MongooseModule.forRoot('mongodb+srv://valdismin:Vl281296vO@cluster0.yepohjo.mongodb.net/express-homework?retryWrites=true&w=majority&appName=Cluster0'),
        MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}]),
        MongooseModule.forFeature([{name: Post.name, schema: PostSchema}]),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    ],
    controllers: [AppController, BlogsController, PostsController, UsersController, TestAllController],
    providers: [AppService, BlogsService, BlogsRepository, PostsService, PostsRepository, UsersService, UsersRepository],
})
export class AppModule {
}
