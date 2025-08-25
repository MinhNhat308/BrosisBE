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
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:3000', 'http://localhost:8082'],
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
