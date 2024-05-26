import { PostsRepository } from "./posts.repository";
import { InputPostType, OutputPaginatedPostType, PostDBType, PostViewModelType } from "./posts.types";
import { Injectable } from "@nestjs/common";
import { BlogsRepository } from "../blogsFeature/blogs.repository";

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository, private readonly blogsRepository: BlogsRepository) {
  }

  async createPost(post: InputPostType, blogId?: string): Promise<string> {
    const id = blogId || post.blogId;
    const blog = await this.blogsRepository.getBlogById(id);
    const newPost = {
      createdAt: new Date().toISOString(),
      blogName: blog?.name || '',
      blogId: id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content
    };
    const createdPostId = await this.postsRepository.createPost(newPost);

    return createdPostId.toString();
  }

  async getPosts(query: any, blogId: string, userId?: string): Promise<OutputPaginatedPostType> {
    return await this.postsRepository.getPosts(query, blogId, userId);
  }

  async getPostById(id: string, userId?: string): Promise<PostViewModelType> {
    return await this.postsRepository.getPostById(id, userId);
  }

  async deletePost(id: string): Promise<void> {
    return await this.postsRepository.deletePost(id);
  }

  async updatePost(post: InputPostType, id: string): Promise<void> {
    return await this.postsRepository.updatePost(post, id);
  }
}
