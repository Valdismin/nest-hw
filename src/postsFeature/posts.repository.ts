import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post, PostDocument } from "./posts.schema";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { LikesAndDislikesType, LikeStatus, OutputPaginatedPostType, PostViewModelType } from "./posts.types";

@Injectable()
export class PostsRepository {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
    }
    async createPost(dto) {
        const post = new this.postModel(dto);
        await post.save();
        return post._id.toString();
    }
    async updatePost(dto, id) {
        const result = await this.postModel.updateOne({ _id: id }, { $set: dto }).exec();
        if (result.modifiedCount === 0) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
        return
    }
    async deletePost(id): Promise<void> {
        const result = await this.postModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
        return
    }
    async getPostById(id: string, userId?: string): Promise<PostViewModelType> {
        const post = await this.postModel.findOne({_id: id}).exec()
        if (!post) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }

        const postLikeStatus = await this.postModel.findOne({_id: id, likes: {$elemMatch: {userId: userId}}}).exec()
        const likesCount = post.likes.filter((like: LikesAndDislikesType) => like.likeStatus === LikeStatus.Like).length
        const dislikesCount = post.likes.filter((like: LikesAndDislikesType) => like.likeStatus === LikeStatus.Dislike).length
        const newestLikes = post.likes.filter((like) => like.likeStatus === LikeStatus.Like).sort((a: LikesAndDislikesType, b: LikesAndDislikesType) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }).slice(0, 3).map((like: LikesAndDislikesType) => {
            return {
                addedAt: like.createdAt,
                userId: like.userId,
                login: like.userLogin
            }
        })

        if (!userId || !postLikeStatus) {
            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: likesCount,
                    dislikesCount: dislikesCount,
                    myStatus: LikeStatus.None,
                    newestLikes: newestLikes
                }
            }
        }


        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: likesCount,
                dislikesCount: dislikesCount,
                myStatus: postLikeStatus.likes[0].likeStatus,
                newestLikes: newestLikes
            }
        }
    }

    async getPosts(query: any, blogId: string, userId?: string): Promise<OutputPaginatedPostType> {
        const id = blogId ? {blogId: blogId} : {}
        try {
            const items: any = await this.postModel.find(id).sort({[query.sortBy]: query.sortDirection})
              .skip((query.pageNumber - 1) * query.pageSize)
              .limit(query.pageSize)

            const c = await this.postModel.countDocuments(id).exec()

            const sanitizedItems = items.map((item: any) => {
                const likesCount = item.likes.filter((like: LikesAndDislikesType) => like.likeStatus === LikeStatus.Like).length
                const dislikesCount = item.likes.filter((like: LikesAndDislikesType) => like.likeStatus === LikeStatus.Dislike).length
                const myStatus = item.likes.find((like: LikesAndDislikesType) => like.userId === userId)?.likeStatus || LikeStatus.None
                const newestLikes = item.likes.filter((like: LikesAndDislikesType) => like.likeStatus === LikeStatus.Like)
                  .sort((a: LikesAndDislikesType, b: LikesAndDislikesType) => {
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  }).slice(0, 3)
                  .map((like: LikesAndDislikesType) => {
                      return {
                          addedAt: like.createdAt,
                          userId: like.userId,
                          login: like.userLogin
                      }
                  })
                return {
                    id: item._id,
                    title: item.title,
                    shortDescription: item.shortDescription,
                    content: item.content,
                    blogId: item.blogId,
                    blogName: item.blogName,
                    createdAt: item.createdAt,
                    extendedLikesInfo: {
                        likesCount,
                        dislikesCount,
                        myStatus,
                        newestLikes: newestLikes
                    }
                }
            })


            return {
                items: sanitizedItems,
                totalCount: c,
                pagesCount: Math.ceil(c / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize
            }
        } catch (e) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
