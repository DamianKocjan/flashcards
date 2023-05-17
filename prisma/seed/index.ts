import { PrismaClient } from "@prisma/client";

import { seedCategories } from "./categories";
import { seedFlashcardset } from "./flashcardset";

const prisma = new PrismaClient();

async function main() {
  await seedCategories(prisma);
  await seedFlashcardset(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
