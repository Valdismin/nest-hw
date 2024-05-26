import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Blog, BlogDocument } from "./blogs.schema";
import { Model } from "mongoose";
import { BlogDBType, BlogViewModelType, InputBlogType, OutputPaginatedBlogsType } from "./blogs.types";
import { blogsMapper } from "../utils";

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {
  }

  async getBlogs(query: any): Promise<OutputPaginatedBlogsType> {
    const search = query.searchNameTerm ? {name: {$regex: query.searchNameTerm, $options: 'i'}} : {}
    try {
      const items: any = await this.blogModel.find(search).sort({[query.sortBy]: query.sortDirection})
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize)
      const c = await this.blogModel.countDocuments(search).exec()

      const mappedBlogs = blogsMapper(items)

      return {
        items: mappedBlogs,
        totalCount: c,
        pagesCount: Math.ceil(c / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize
      }
    } catch (e) {
      throw new HttpException("Blogs not Found", HttpStatus.NOT_FOUND);
    }

  }

  async createBlog(dto: BlogDBType): Promise<string> {
    const newBlog = await new this.blogModel(dto);
    const createdBlog = await newBlog.save();
    return createdBlog._id.toString();
  }

  async getBlogById(id: string): Promise<BlogViewModelType> {
    const blog = await this.blogModel.findOne({ _id: id }).exec();

    if (!blog) {
      throw new HttpException("Blog not found", HttpStatus.NOT_FOUND);
    }

    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership
    };
  }

  async deleteBlog(id: string): Promise<void> {
    const result = await this.blogModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException("Blog not found", HttpStatus.NOT_FOUND);
    }
  }

  async updateBlog(id: string, dto: InputBlogType): Promise<void> {
    const result = await this.blogModel.updateOne({ _id: id }, {$set: dto}).exec();
    if (result.modifiedCount === 0) {
      throw new HttpException("Blog not found", HttpStatus.NOT_FOUND);
    }
    return
  }
}
