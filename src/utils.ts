export const queryHelper = (query: any) => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : 'createdAt',
    sortDirection: query.sortDirection ? query.sortDirection : 'desc',
    searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
    searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
    searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
  }
}

export const blogsMapper = (blogs:any) => {
  return blogs.map((blog:any) => ({
    id: blog._id,
    title: blog.title,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  }))

}
