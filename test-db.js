import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

try {
    await prisma.$connect();
    console.log('✅ Database connected!');
    await prisma.$disconnect();
} catch (err) {
    console.error('❌ Connection failed:', err);
}