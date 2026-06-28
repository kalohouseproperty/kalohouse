import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/prisma/generated/client/client";

const prismaClientSingleton = () => {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.warn("DATABASE_URL is not set. Prisma might fail if executed.");
  }

  const pool = new Pool({ 
    connectionString: connectionString?.replace(/\?.*/, ""),
    max: 5,
    idleTimeoutMillis: 30000,
    // Using the higher value from remote while ensuring our fix is integrated
    connectionTimeoutMillis: 30000,
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
