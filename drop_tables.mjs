import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecotechne',
  });

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS image_product;`);
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS image_service;`);
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS gallery;`);
  console.log('Tables dropped');
}

main().finally(() => prisma.$disconnect());
