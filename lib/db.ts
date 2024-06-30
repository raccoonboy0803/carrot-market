import { PrismaClient } from '@prisma/client';

const db = new PrismaClient(); // DB를 위한 Client 생성

export default db;
