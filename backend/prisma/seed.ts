import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('demo', 12)
  await prisma.admin.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: { name: 'Admin Principal', email: 'admin@demo.com', password, role: 'Admin' },
  })
  console.log('Seed OK — admin@demo.com / demo')
}

main().catch(console.error).finally(() => prisma.$disconnect())
