import { ObjectId } from "mongoose";

export interface BlogDBType {
  _id?: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt?: string;
  isMembership?: boolean;
}

export type InputBlogType = {
  name: string,
  description: string,
  websiteUrl: string,
  createdAt?: string,
  isMembership?: boolean
}

export type BlogViewModelType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt?: string;
  isMembership?: boolean;
}

export type OutputPaginatedBlogType = {
  id: ObjectId,
  title: string,
  description: string,
  websiteUrl: string,
  createdAt?: string,
  isMembership?: boolean
}

export type OutputPaginatedBlogsType = {
  items: OutputPaginatedBlogType[],
  totalCount: number,
  pagesCount: number,
  page: string,
  pageSize: string
}
