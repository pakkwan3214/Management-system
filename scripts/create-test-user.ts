import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/auth";

const db = new PrismaClient();

async function main() {
  const passwordHash = await hashPassword("TestPassword123!");

  const user = await db.user.upsert({
    where: {
      email: "admin@test.local",
    },
    update: {
      firstName: "Test",
      lastName: "Admin",
      passwordHash,
      isActive: true,
    },
    create: {
      firstName: "Test",
      lastName: "Admin",
      email: "admin@test.local",
      passwordHash,
      isActive: true,
    },
  });

  console.log(`Created/updated test user: ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

