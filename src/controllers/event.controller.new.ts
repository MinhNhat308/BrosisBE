import { Request, Response } from 'express'
import prismaService from '../services/prisma.service'

export const eventController = {
  // Get all events
  getAll: async (req: Request, res: Response) => {
    try {
      const events = await prismaService.client.events.findMany({
        include: {
          tags: true,
          registrations: {
            select: {
              id: true,
              student_name: true,
              status: true
            }
          },
          _count: {
            select: {
              likes: true,
              registrations: true
            }
          }
        },
        orderBy: {
          start_date: 'asc'
        }
      })
      
      res.json(events)
    } catch (error) {
      console.error('Error fetching events:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // Get event by ID
  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const event = await prismaService.client.events.findUnique({
        where: { id: parseInt(id) },
        include: {
          tags: true,
          registrations: {
            select: {
              id: true,
              student_name: true,
              student_email: true,
              major: true,
              semester: true,
              status: true,
              registered_at: true
            }
          },
          _count: {
            select: {
              likes: true,
              registrations: true
            }
          }
        }
      })
      
      if (!event) {
        return res.status(404).json({ error: 'Event not found' })
      }
      
      return res.json(event)
    } catch (error) {
      console.error('Error fetching event:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  },

  // Create new event
  create: async (req: Request, res: Response) => {
    try {
      const { tags, ...eventData } = req.body
      
      const event = await prismaService.client.events.create({
        data: {
          ...eventData,
          tags: tags ? {
            create: tags.map((tag: string) => ({ tag_name: tag }))
          } : undefined
        },
        include: {
          tags: true,
          _count: {
            select: {
              likes: true,
              registrations: true
            }
          }
        }
      })
      
      res.status(201).json(event)
    } catch (error) {
      console.error('Error creating event:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // Update event
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { tags, ...eventData } = req.body
      
      // Delete existing tags and create new ones
      if (tags) {
        await prismaService.client.event_tags.deleteMany({
          where: { event_id: parseInt(id) }
        })
      }
      
      const event = await prismaService.client.events.update({
        where: { id: parseInt(id) },
        data: {
          ...eventData,
          tags: tags ? {
            create: tags.map((tag: string) => ({ tag_name: tag }))
          } : undefined
        },
        include: {
          tags: true,
          _count: {
            select: {
              likes: true,
              registrations: true
            }
          }
        }
      })
      
      res.json(event)
    } catch (error) {
      console.error('Error updating event:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // Delete event
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      
      await prismaService.client.events.delete({
        where: { id: parseInt(id) }
      })
      
      res.status(204).send()
    } catch (error) {
      console.error('Error deleting event:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // Register for event
  register: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const registrationData = req.body
      
      // Check if event exists and has capacity
      const event = await prismaService.client.events.findUnique({
        where: { id: parseInt(id) },
        include: {
          _count: {
            select: { registrations: true }
          }
        }
      })
      
      if (!event) {
        return res.status(404).json({ error: 'Event not found' })
      }
      
      if (event.max_participants && event._count.registrations >= event.max_participants) {
        return res.status(400).json({ error: 'Event is full' })
      }
      
      const registration = await prismaService.client.event_registrations.create({
        data: {
          event_id: parseInt(id),
          ...registrationData
        }
      })
      
      // Update current participants count
      await prismaService.client.events.update({
        where: { id: parseInt(id) },
        data: {
          current_participants: {
            increment: 1
          }
        }
      })
      
      return res.status(201).json(registration)
    } catch (error) {
      console.error('Error registering for event:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  },

  // Toggle like for event
  toggleLike: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const userIp = req.ip || req.connection.remoteAddress || 'unknown'
      
      const existingLike = await prismaService.client.event_likes.findUnique({
        where: {
          event_id_user_ip: {
            event_id: parseInt(id),
            user_ip: userIp
          }
        }
      })
      
      if (existingLike) {
        // Unlike
        await prismaService.client.event_likes.delete({
          where: {
            event_id_user_ip: {
              event_id: parseInt(id),
              user_ip: userIp
            }
          }
        })
        
        const likeCount = await prismaService.client.event_likes.count({
          where: { event_id: parseInt(id) }
        })
        
        res.json({ liked: false, likes: likeCount })
      } else {
        // Like
        await prismaService.client.event_likes.create({
          data: {
            event_id: parseInt(id),
            user_ip: userIp
          }
        })
        
        const likeCount = await prismaService.client.event_likes.count({
          where: { event_id: parseInt(id) }
        })
        
        res.json({ liked: true, likes: likeCount })
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // Get event categories
  getCategories: async (req: Request, res: Response) => {
    try {
      const categories = await prismaService.client.event_categories.findMany()
      res.json(categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  // Get academic calendar
  getAcademicCalendar: async (req: Request, res: Response) => {
    try {
      const { semester } = req.query
      const calendar = await prismaService.client.academic_calendar.findMany({
        where: semester ? { semester: semester as string } : undefined,
        orderBy: { start_date: 'asc' }
      })
      res.json(calendar)
    } catch (error) {
      console.error('Error fetching academic calendar:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
