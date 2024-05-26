import { Injectable } from "@nestjs/common";
import { BlogsRepository } from "./blogs.repository";
import { BlogDocument } from "./blogs.schema";
import { BlogViewModelType, InputBlogType, OutputPaginatedBlogsType } from "./blogs.types";

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {
  }

  getBlogs(query: any): Promise<OutputPaginatedBlogsType>  {
    return this.blogsRepository.getBlogs(query);
  }

  createBlog(blog:InputBlogType): Promise<string> {
    const newBlog = {
      createdAt: new Date().toISOString(),
      isMembership: false,
      ...blog
    }
    return this.blogsRepository.createBlog(newBlog);
  }

  getBlogById(id: string): Promise<BlogViewModelType> {
    return this.blogsRepository.getBlogById(id);
  }

  deleteBlog(id: string): Promise<void> {
    return this.blogsRepository.deleteBlog(id);
  }

  updateBlog(id: string, blog: InputBlogType): Promise<void> {
    return this.blogsRepository.updateBlog(id, blog);
  }
}
