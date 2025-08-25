import { Request, Response, NextFunction } from 'express'
import { blogService } from '../services/blog.services'

export const blogController = {
  // Get all tags
  getAllTags: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tags = await blogService.getAllTags()
      res.json(tags)
    } catch (error) {
      return next(error)
    }
  },

  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogs = await blogService.getAll()
      res.json(blogs)
    } catch (error) {
      return next(error)
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' })
      }
      const blog = await blogService.getById(id)
      if (!blog) return res.status(404).json({ message: 'Blog not found' })
      return res.json(blog)
    } catch (error) {
      return next(error)
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, content, author, image_url, tagIds } = req.body
      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' })
      }
      
      // Validate content length (10000 characters max)
      if (content.length > 10000) {
        return res.status(400).json({ 
          message: `Content too long. Maximum 10,000 characters allowed (current: ${content.length} characters)` 
        })
      }
      
      const newBlog = await blogService.create(title, content, author, image_url, tagIds)
      return res.status(201).json(newBlog)
    } catch (error) {
      return next(error)
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' })
      }
      const { title, content, author, image_url } = req.body
      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' })
      }
      
      // Validate content length (10000 characters max)
      if (content.length > 10000) {
        return res.status(400).json({ 
          message: `Content too long. Maximum 10,000 characters allowed (current: ${content.length} characters)` 
        })
      }
      const updated = await blogService.update(id, title, content, author, image_url)
      return res.json(updated)
    } catch (error) {
      return next(error)
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' })
      }
      await blogService.delete(id)
      res.json({ message: 'Blog deleted successfully' })
    } catch (error) {
      return next(error)
    }
  },

  incrementViews: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' })
      }
      await blogService.incrementViews(id)
      // Get the updated blog to return current views
      const blog = await blogService.getById(id)
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' })
      }
      res.json({ views: (blog as any).views || 0 })
    } catch (error) {
      return next(error)
    }
  },

  toggleLike: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' })
      }
      const { increment } = req.body // true to increment, false to decrement
      await blogService.toggleLike(id, increment)
      // Get the updated blog to return current likes
      const blog = await blogService.getById(id)
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' })
      }
      res.json({ likes: (blog as any).likes || 0 })
    } catch (error) {
      return next(error)
    }
  }
}
