import { PrismaClient } from "../prisma/generated/client/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log("Clearing all user data from database...");

  const tables = [
    "visit_requests",
    "refunds",
    "payouts",
    "payments",
    "verifications",
    "property_media",
    "agent_invites",
    "properties",
    "commission_settings",
    "accounts",
    "sessions",
    "verification_tokens",
    "users",
  ];

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
    console.log(`  Cleared ${table}`);
  }

  // Reset sequences
  await prisma.$executeRawUnsafe(`
    SELECT setval(pg_get_serial_sequence('users', 'id'), 1, false);
    SELECT setval(pg_get_serial_sequence('properties', 'id'), 1, false);
    SELECT setval(pg_get_serial_sequence('payments', 'id'), 1, false);
    SELECT setval(pg_get_serial_sequence('payouts', 'id'), 1, false);
    SELECT setval(pg_get_serial_sequence('refunds', 'id'), 1, false);
    SELECT setval(pg_get_serial_sequence('visit_requests', 'id'), 1, false);
    SELECT setval(pg_get_serial_sequence('agent_invites', 'id'), 1, false);
    SELECT setval(pg_get_serial_sequence('verifications', 'id'), 1, false);
  `);

  console.log("\nDatabase cleared. All sequences reset.");
  await prisma.$disconnect();
}

clearDatabase().catch((e) => {
  console.error("Failed to clear database:", e);
  process.exit(1);
});
