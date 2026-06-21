import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'oshanjr@admin.com'
  
  // Check if it already exists
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log('User already exists!')
    return
  }

  const passwordHash = await bcrypt.hash('Oshan@2004', 10)
  const user = await prisma.user.create({
    data: {
      email: email,
      passwordHash,
      role: 'SYSTEM_ADMIN',
      name: 'oshanjr'
    }
  })
  console.log('Admin user created successfully:', user.email)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
