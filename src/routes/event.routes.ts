import { Router } from 'express'
import { eventController } from '../controllers/event.controller'
import { registerForEvent } from '../controllers/registration.controller'
import { validateStudent } from '../controllers/student.controller'

const router = Router()

// Event routes
router.get('/', eventController.getAll)
router.get('/:id', eventController.getById)
router.post('/', eventController.create)
router.put('/:id', eventController.update)
router.delete('/:id', eventController.delete)

// Registration route for events
router.post('/:id/register', registerForEvent)

// Validate student route
router.post('/validate-student', validateStudent)

export default router
