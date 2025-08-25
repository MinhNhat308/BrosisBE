import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import fs from 'fs'
import path from 'path'

// Load environment variables
if (fs.existsSync(path.join(__dirname, '.env'))) {
  require('dotenv').config()
}

import prismaService from './src/services/prisma.service'
import redisService from './src/utils/redis'
import { defaultErrorHandler } from './src/middlewares/error.middlewares'
import blogRouter from './src/routes/blog.routes'
import eventRouter from './src/routes/event.routes'
import registrationRouter from './src/routes/registration.routes'
import studentRouter from './src/routes/student.routes'
import documentRouter from './src/routes/document.routes'



// ---------------------------     SERVER    --------------------------- //
const port = process.env.PORT || 8081
const app = express()

// ---------------------------      CORS     --------------------------- //
app.use(
  cors({
    origin: [
      'http://localhost:8080', 
      'http://127.0.0.1:8080', 
      'http://localhost:3000', 
      'http://localhost:8082',
      'https://brosis-frontend.onrender.com',
      'https://brosis2025.onrender.com',
      /\.onrender\.com$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

// ---------------------------   DATABASE    --------------------------- //
prismaService.connect()
redisService.connect()

// ---------------------------     ROUTER    --------------------------- //
app.use(express.json())

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'BroSis 2025 API Server is running!',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

// Health check route for Render
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

// API routes
app.use('/api/blog', blogRouter)
app.use('/api/events', eventRouter)
app.use('/api/students', studentRouter)
app.use('/api/registrations', registrationRouter)
app.use('/api/documents', documentRouter)

// --------------------------- ERROR HANDLER --------------------------- //
app.use(defaultErrorHandler)

// ---------------------------   RUN SERVER  --------------------------- //
const serverHttp = createServer(app)

serverHttp.listen(port, () => {
  console.log(`🚀 PROJECT BlogAPI OPEN ON PORT: ${port}`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...')
  
  serverHttp.close(async () => {
    console.log('✅ HTTP server closed')
    
    try {
      await prismaService.client.$disconnect()
      console.log('✅ Database connection closed')
    } catch (error) {
      console.error('❌ Error closing database connection:', error)
    }
    
    process.exit(0)
  })
})
