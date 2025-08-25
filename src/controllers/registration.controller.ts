import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

const prisma = new PrismaClient()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Configure multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event-registrations',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'limit' },
      { quality: 'auto' }
    ],
    public_id: (req: any, file: any) => {
      const studentId = req.body.student_id || 'unknown'
      const timestamp = Date.now()
      return `${studentId}_${timestamp}`
    }
  } as any
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// Register for event
export const registerForEvent = [
  upload.single('student_image'),
  async (req: Request, res: Response) => {
    try {
      const {
        student_name,
        student_id,
        student_email,
        student_phone,
        major,
        semester,
        class_code,
        event_id,
        event_title,
        registration_date
      } = req.body

      // Validate required fields
      if (!student_name || !student_id || !student_email || !event_id) {
        return res.status(400).json({
          error: 'Missing required fields: student_name, student_id, student_email, event_id'
        })
      }

      // Check if event exists
      const event = await prisma.events.findUnique({
        where: { id: parseInt(event_id) }
      })

      if (!event) {
        return res.status(404).json({
          error: 'Event not found'
        })
      }

      // Check if student already registered for this event (by student_id OR email)
      const existingRegistration = await prisma.event_registrations.findFirst({
        where: {
          event_id: parseInt(event_id),
          OR: [
            { student_id: student_id },
            { student_email: student_email }
          ]
        }
      })

      if (existingRegistration) {
        return res.status(409).json({
          success: false,
          error: 'Bạn đã đăng ký sự kiện này rồi!',
          details: student_id ? 
            `Mã sinh viên ${student_id} đã đăng ký` : 
            `Email ${student_email} đã đăng ký`
        })
      }

      // Get uploaded file info from Cloudinary
      const imageInfo = req.file ? {
        cloudinary_id: (req.file as any).public_id,
        secure_url: (req.file as any).secure_url,
        original_filename: req.file.originalname,
        size: req.file.size,
        format: (req.file as any).format,
        resource_type: (req.file as any).resource_type
      } : null

      // Create registration record
      const registration = await prisma.event_registrations.create({
        data: {
          event_id: parseInt(event_id),
          student_name,
          student_id,
          student_email,
          student_phone: student_phone || null,
          major: major || null,
          semester: semester || null,
          class_code: class_code || null,
          notes: imageInfo ? `Image uploaded: ${imageInfo.original_filename} - Cloudinary URL: ${imageInfo.secure_url}` : null,
          status: 'registered',
          registered_at: registration_date ? new Date(registration_date) : new Date()
        }
      })

      // Update current participants count
      await prisma.events.update({
        where: { id: parseInt(event_id) },
        data: {
          current_participants: {
            increment: 1
          }
        }
      })

      // Log registration info for admin
      console.log('=== NEW EVENT REGISTRATION ===')
      console.log('Event:', event_title || event.title)
      console.log('Student:', student_name)
      console.log('Student ID:', student_id)
      console.log('Student Email:', student_email)
      console.log('Registration Date:', new Date().toLocaleString('vi-VN'))
      if (imageInfo) {
        console.log('Cloudinary Image ID:', imageInfo.cloudinary_id)
        console.log('Image URL:', imageInfo.secure_url)
        console.log('Image Size:', (imageInfo.size / 1024 / 1024).toFixed(2) + ' MB')
      }
      console.log('================================')

      // Return success response
      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          registration_id: registration.id,
          event_title: event.title,
          student_name,
          student_id,
          image_uploaded: !!imageInfo,
          image_info: imageInfo
        }
      })

    } catch (error) {
      console.error('Registration error:', error)
      
      // Note: Cloudinary handles file cleanup automatically if upload fails
      // No need to manually delete files like with local storage

      return res.status(500).json({
        error: 'Internal server error during registration',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
]

// Delete registration (for testing)
export const deleteRegistration = async (req: Request, res: Response) => {
  try {
    const { registrationId } = req.params

    const deleted = await prisma.event_registrations.delete({
      where: {
        id: parseInt(registrationId)
      }
    })

    return res.json({
      success: true,
      message: 'Registration deleted successfully',
      data: deleted
    })

  } catch (error) {
    console.error('Delete registration error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// Get all registrations for an event (admin only)
export const getEventRegistrations = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params

    const registrations = await prisma.event_registrations.findMany({
      where: {
        event_id: parseInt(eventId)
      },
      include: {
        event: {
          select: {
            title: true,
            start_date: true,
            location: true
          }
        }
      },
      orderBy: {
        registered_at: 'desc'
      }
    })

    return res.json({
      success: true,
      data: registrations
    })

  } catch (error) {
    console.error('Error fetching registrations:', error)
    return res.status(500).json({
      error: 'Failed to fetch registrations'
    })
  }
}

// Get all registrations (admin only)
export const getAllRegistrations = async (req: Request, res: Response) => {
  try {
    const registrations = await prisma.event_registrations.findMany({
      include: {
        event: {
          select: {
            title: true,
            start_date: true,
            location: true
          }
        }
      },
      orderBy: {
        registered_at: 'desc'
      }
    })

    console.log('=== ALL EVENT REGISTRATIONS ===')
    registrations.forEach((reg, index) => {
      console.log(`${index + 1}. ${reg.student_name} (${reg.student_id})`)
      console.log(`   Event: ${reg.event.title}`)
      console.log(`   Date: ${reg.registered_at.toLocaleString('vi-VN')}`)
      console.log(`   Status: ${reg.status}`)
      console.log('---')
    })
    console.log('================================')

    return res.json({
      success: true,
      total: registrations.length,
      data: registrations
    })

  } catch (error) {
    console.error('Error fetching all registrations:', error)
    return res.status(500).json({
      error: 'Failed to fetch registrations'
    })
  }
}
