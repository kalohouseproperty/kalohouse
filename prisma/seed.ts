import "dotenv/config";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole, Prisma } from "./generated/client/client";
import { getDistricts, getSectors } from "rwanda-locations";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const Decimal = Prisma.Decimal;

async function main() {
  console.log("Starting seed...");

  // Cleanup
  await prisma.propertyMedia.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.visitRequest.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.property.deleteMany();
  await prisma.agentInvite.deleteMany();
  await prisma.user.deleteMany();
  await prisma.sector.deleteMany();
  await prisma.commissionSetting.deleteMany();

  // Create Sectors (all provinces)
  const sectorMap: Record<string, number> = {};
  const provinces = ["City Of Kigali", "Southern", "Western", "Northern", "Eastern"];

  for (const province of provinces) {
    const districts = getDistricts(province) || [];
    for (const district of districts) {
      const sectorNames = getSectors(province, district) || [];
      for (const name of sectorNames) {
        const sector = await prisma.sector.create({
          data: { district, name },
        });
        sectorMap[`${district}-${name}`] = sector.id;
      }
    }
  }

  console.log(`Seeded ${Object.keys(sectorMap).length} sectors across ${provinces.length} provinces`);

  // Create Commission Settings
  await prisma.commissionSetting.create({
    data: { rate: new Decimal("0.1000"), is_active: true },
  });

  // Create Users
  const adminPassword = await bcrypt.hash("kalohouse2026", 10);

  await prisma.user.create({
    data: {
      email: "admin@kalohouse.rw",
      full_name: "Kalohouse Admin",
      password: adminPassword,
      role: UserRole.admin,
      is_active: true,
      is_verified: true,
    },
  });

  console.log("Seed completed successfully (Clean Start).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
