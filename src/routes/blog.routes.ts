import { Router } from 'express'
import { blogController } from '../controllers/blog.controller'

const blogRouter = Router()

// Tag routes
blogRouter.get('/tags', blogController.getAllTags)

// Blog routes
blogRouter.get('/', blogController.getAll)
blogRouter.get('/:id', blogController.getById)
blogRouter.post('/', blogController.create)
blogRouter.put('/:id', blogController.update)
blogRouter.delete('/:id', blogController.delete)
blogRouter.post('/:id/views', blogController.incrementViews)
blogRouter.post('/:id/like', blogController.toggleLike)

export default blogRouter
