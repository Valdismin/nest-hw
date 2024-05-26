import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { BlogsService } from "./blogs.service";
import { BlogDocument } from "./blogs.schema";
import { BlogViewModelType, InputBlogType, OutputPaginatedBlogsType } from "./blogs.types";
import { queryHelper } from "../utils";
import { PostsService } from "../postsFeature/posts.service";
import { OutputPaginatedPostType } from "../postsFeature/posts.types";

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
  getBlogById(id: string): Promise<BlogViewModelType> {
    return this.blogsService.getBlogById(id);
  }

  @Delete(':id')
  deleteBlog(@Param('id') id: string): Promise<void> {
    return this.blogsService.deleteBlog(id);
  }

  @Put(':id')
  updateBlog(@Param('id') id: string, @Body() updateBlogDto: InputBlogType): Promise<void> {
    return this.blogsService.updateBlog(id, updateBlogDto);
  }

  @Get(':id/posts')
  getPostsByBlogId(@Param('id') id: string, @Query() query:any): Promise<OutputPaginatedPostType> {
    const sanitizedQuery = queryHelper(query)
    return this.postsService.getPosts(sanitizedQuery, id);
  }

  @Post(':id/posts')
  createPost(@Param('id') id: string, @Body() createPostDto: any): Promise<string> {
    return this.postsService.createPost(createPostDto);
  }
}
