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
import { BlogsService } from "./blogs.service";
import { BlogViewModelType, InputBlogType, OutputPaginatedBlogsType } from "./blogs.types";
import { queryHelper } from "../utils";
import { PostsService } from "../postsFeature/posts.service";
import {OutputPaginatedPostType, PostViewModelType} from "../postsFeature/posts.types";

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService,
              private readonly postsService: PostsService) {}

  @Get()
  getBlogs(@Query() query:any): Promise<OutputPaginatedBlogsType> {
    const sanitizedQuery = queryHelper(query)
    return this.blogsService.getBlogs(sanitizedQuery);
  }

  @Post()
  async createBlog(@Body() createBlogDto: InputBlogType): Promise<BlogViewModelType> {
    const createdBlogId = await this.blogsService.createBlog(createBlogDto);
    return this.blogsService.getBlogById(createdBlogId)
  }

  @Get(':id')
  getBlogById(@Param('id') id: string): Promise<BlogViewModelType> {
    return this.blogsService.getBlogById(id);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteBlog(@Param('id') id: string): Promise<void> {
    return this.blogsService.deleteBlog(id);
  }

  @Put(':id')
  @HttpCode(204)
  updateBlog(@Param('id') id: string, @Body() updateBlogDto: InputBlogType): Promise<void> {
    return this.blogsService.updateBlog(id, updateBlogDto);
  }

  @Get(':id/posts')
  async getPostsByBlogId(@Param('id') id: string, @Query() query:any): Promise<OutputPaginatedPostType> {
    await this.blogsService.getBlogById(id)
    const sanitizedQuery = queryHelper(query)
    return await this.postsService.getPosts(sanitizedQuery, id);
  }

  @Post(':id/posts')
  async createPost(@Param('id') id: string, @Body() createPostDto: any): Promise<PostViewModelType> {
    await this.blogsService.getBlogById(id)

    const postId = await this.postsService.createPost(createPostDto, id);
    return await this.postsService.getPostById(postId);
  }
}
