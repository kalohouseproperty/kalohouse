import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/prisma/generated/client/client";

const prismaClientSingleton = () => {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.warn("DATABASE_URL is not set. Prisma might fail if executed.");
  }

  const isNeon = connectionString?.includes("neon.tech");
  
  const pool = new Pool({ 
    connectionString: connectionString,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000,
    ssl: isNeon ? { rejectUnauthorized: false } : undefined,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
