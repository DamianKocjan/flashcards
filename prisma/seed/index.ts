import { PrismaClient } from "@prisma/client";
import { seedCategories } from "./categories";

const prisma = new PrismaClient();

async function main() {
  await seedCategories(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
