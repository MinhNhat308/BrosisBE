import { Request, Response, NextFunction } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export function defaultErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error occurred:', err)

  // Handle Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Unique constraint violation', error: err.message })
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Record not found', error: err.message })
    }
    return res.status(400).json({ message: 'Database error', error: err.message })
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation error', error: err.message })
  }

  // Handle syntax errors
  if (err instanceof SyntaxError) {
    return res.status(400).json({ message: 'Invalid JSON format', error: err.message })
  }

  // Default error
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  
  return res.status(statusCode).json({ 
    message: statusCode === 500 ? 'Internal Server Error' : message,
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
}
