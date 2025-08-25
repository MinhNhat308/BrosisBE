import { Router } from 'express'
import { registerForEvent, getEventRegistrations, getAllRegistrations, deleteRegistration } from '../controllers/registration.controller'

const router = Router()

// Public routes
router.post('/register', registerForEvent)

// Admin routes (you can add authentication middleware later)
router.get('/registrations', getAllRegistrations)
router.get('/:eventId/registrations', getEventRegistrations)
router.delete('/registrations/:registrationId', deleteRegistration)

export default router
