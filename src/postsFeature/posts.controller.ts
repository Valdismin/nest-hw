import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { InputPostType, OutputPaginatedPostType, PostViewModelType } from "./posts.types";
import { queryHelper } from "../utils";
import { BlogsRepository } from "../blogsFeature/blogs.repository";

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService,
              private readonly blogsRepository: BlogsRepository) {}

  @Get()
  async getPosts(@Query() query: any, @Param('blogId') blogId: string): Promise<OutputPaginatedPostType> {
    const sanitizedQuery = queryHelper(query)
    if (blogId) {
      const blog = await this.blogsRepository.getBlogById(blogId)
      if (!blog) {
        throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
      }
    }

    return await this.postsService.getPosts(sanitizedQuery, blogId)
  }

  @Post()
  async createPost(@Body() post: InputPostType): Promise<PostViewModelType> {
    const postId = await this.postsService.createPost(post);
    return await this.postsService.getPostById(postId);
  }

  @Get(':id')
  getPostById(@Param('id') id: string): Promise<PostViewModelType> {
    return this.postsService.getPostById(id);
  }

  @Put(':id')
  @HttpCode(204)
  async updatePost(@Body() post: InputPostType, @Param('id') id: string): Promise<void> {
   await this.postsService.updatePost(post, id);
    return
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') id: string): Promise<void> {
    await this.postsService.deletePost(id);
    return
  }
}
