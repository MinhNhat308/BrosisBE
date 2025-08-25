import { PrismaClient } from '@prisma/client'

class PrismaService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  connect() {
    return this.prisma.$connect()
  }

  get client() {
    return this.prisma
  }
}

const prismaService = new PrismaService()
export default prismaService
