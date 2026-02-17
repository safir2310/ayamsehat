import type { PrismaClientOptions } from '@prisma/client'

const config: PrismaClientOptions = {
  log: ['query', 'info', 'warn', 'error'],
}

export default config
