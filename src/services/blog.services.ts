import prismaService from './prisma.service'

export const blogService = {
  // Get all tags
  getAllTags: async () => {
    return await prismaService.client.$queryRaw`SELECT * FROM tags ORDER BY name`
  },

  // Get all blogs with their tags
  getAll: async () => {
    const blogs = await prismaService.client.$queryRaw`
      SELECT 
        b.*,
        GROUP_CONCAT(t.name) as tag_names
      FROM blogs b
      LEFT JOIN blogs_tags bt ON b.id = bt.blog_id
      LEFT JOIN tags t ON bt.tag_id = t.id
      GROUP BY b.id
      ORDER BY b.created_at DESC
    `
    return (blogs as any[]).map(blog => ({
      ...blog,
      tags: blog.tag_names ? blog.tag_names.split(',') : []
    }))
  },

  // Get blog by ID with tags
  getById: async (id: number) => {
    const blogs = await prismaService.client.$queryRaw`
      SELECT 
        b.*,
        GROUP_CONCAT(t.name) as tag_names
      FROM blogs b
      LEFT JOIN blogs_tags bt ON b.id = bt.blog_id
      LEFT JOIN tags t ON bt.tag_id = t.id
      WHERE b.id = ${id}
      GROUP BY b.id
      LIMIT 1
    `
    const blogArray = blogs as any[]
    if (blogArray.length === 0) return null
    const blogData = blogArray[0]
    return {
      ...blogData,
      tags: blogData.tag_names ? blogData.tag_names.split(',') : []
    }
  },

  // Create blog with tags
  create: async (title: string, content: string, author?: string, image_url?: string, tagIds?: number[]) => {
    // First create the blog
    const result = await prismaService.client.$queryRaw`
      INSERT INTO blogs (title, content, author, image_url) 
      VALUES (${title}, ${content}, ${author}, ${image_url})
    `
    
    // Get the created blog ID
    const blogId = await prismaService.client.$queryRaw`SELECT LAST_INSERT_ID() as id`
    const newBlogId = (blogId as any[])[0].id

    // Add tags if provided
    if (tagIds && tagIds.length > 0) {
      for (const tagId of tagIds) {
        await prismaService.client.$queryRaw`
          INSERT INTO blogs_tags (blog_id, tag_id) VALUES (${newBlogId}, ${tagId})
        `
      }
    }

    // Return the created blog with tags
    return await blogService.getById(newBlogId)
  },
  update: (id: number, title: string, content: string, author?: string, image_url?: string) => {
    return prismaService.client.blogs.update({
      where: { id },
      data: { title, content, author, image_url }
    })
  },
  delete: (id: number) => {
    return prismaService.client.blogs.delete({ where: { id } })
  },
  incrementViews: async (id: number) => {
    // Temporarily using raw SQL until Prisma client is regenerated
    return prismaService.client.$executeRaw`UPDATE blogs SET views = COALESCE(views, 0) + 1 WHERE id = ${id}`
  },
  toggleLike: async (id: number, increment: boolean) => {
    // Temporarily using raw SQL until Prisma client is regenerated
    if (increment) {
      return prismaService.client.$executeRaw`UPDATE blogs SET likes = COALESCE(likes, 0) + 1 WHERE id = ${id}`
    } else {
      return prismaService.client.$executeRaw`UPDATE blogs SET likes = GREATEST(COALESCE(likes, 0) - 1, 0) WHERE id = ${id}`
    }
  }
}
