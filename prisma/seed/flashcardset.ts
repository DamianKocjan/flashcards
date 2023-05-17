import { type Prisma, type PrismaClient } from "@prisma/client";

const TEST_USER_ID = process.env.TEST_USER_ID as string;

const SETS = [
  {
    name: "English",
    description: "Basic English words",
    ownerId: TEST_USER_ID,
    category: {
      connect: {
        name: "English",
      },
    },
    thumbnail: "https://picsum.photos/seed/1/800/600",
    privacy: "PUBLIC",
    flashCards: {
      createMany: {
        data: [
          {
            word: "Hello",
            translation: "Witaj",
          },
          {
            word: "Goodbye",
            translation: "Do widzenia",
          },
          {
            word: "Thank you",
            translation: "Dziękuję",
          },
          {
            word: "Please",
            translation: "Proszę",
          },
          {
            word: "Yes",
            translation: "Tak",
          },
          {
            word: "No",
            translation: "Nie",
          },
          {
            word: "I",
            translation: "Ja",
          },
          {
            word: "You",
            translation: "Ty",
          },
          {
            word: "He",
            translation: "On",
          },
        ],
      },
    },
  },
  {
    name: "English Private",
    description: "Basic private English words",
    ownerId: TEST_USER_ID,
    category: {
      connect: {
        name: "English",
      },
    },
    thumbnail: "https://picsum.photos/seed/2/800/600",
    privacy: "PRIVATE",
    flashCards: {
      createMany: {
        data: [
          {
            word: "Hello",
            translation: "Witaj",
          },
          {
            word: "Goodbye",
            translation: "Do widzenia",
          },
          {
            word: "Thank you",
            translation: "Dziękuję",
          },
          {
            word: "Please",
            translation: "Proszę",
          },
          {
            word: "Yes",
            translation: "Tak",
          },
          {
            word: "No",
            translation: "Nie",
          },
          {
            word: "I",
            translation: "Ja",
          },
          {
            word: "You",
            translation: "Ty",
          },
          {
            word: "He",
            translation: "On",
          },
        ],
      },
    },
  },
  {
    name: "English Unlisted",
    description: "Basic unlisted English words",
    ownerId: TEST_USER_ID,
    category: {
      connect: {
        name: "English",
      },
    },
    thumbnail: "https://picsum.photos/seed/3/800/600",
    privacy: "UNLISTED",
    flashCards: {
      createMany: {
        data: [
          {
            word: "Hello",
            translation: "Witaj",
          },
          {
            word: "Goodbye",
            translation: "Do widzenia",
          },
          {
            word: "Thank you",
            translation: "Dziękuję",
          },
          {
            word: "Please",
            translation: "Proszę",
          },
          {
            word: "Yes",
            translation: "Tak",
          },
          {
            word: "No",
            translation: "Nie",
          },
          {
            word: "I",
            translation: "Ja",
          },
          {
            word: "You",
            translation: "Ty",
          },
          {
            word: "He",
            translation: "On",
          },
        ],
      },
    },
  },
  {
    name: "German",
    description: "Basic German words",
    ownerId: TEST_USER_ID,
    category: {
      connect: {
        name: "German",
      },
    },
    thumbnail: "https://picsum.photos/seed/4/800/600",
    privacy: "PUBLIC",
    flashCards: {
      createMany: {
        data: [
          {
            word: "Hello",
            translation: "Hallo",
          },
          {
            word: "Goodbye",
            translation: "Auf Wiedersehen",
          },
          {
            word: "Thank you",
            translation: "Danke",
          },
          {
            word: "Please",
            translation: "Bitte",
          },
          {
            word: "Yes",
            translation: "Ja",
          },
          {
            word: "No",
            translation: "Nein",
          },
          {
            word: "I",
            translation: "Ich",
          },
          {
            word: "You",
            translation: "Du",
          },
          {
            word: "He",
            translation: "Er",
          },
        ],
      },
    },
  },
] satisfies Prisma.FlashCardSetCreateInput[];

export async function seedFlashcardset(prisma: PrismaClient) {
  await prisma.$transaction(
    SETS.map((set) => prisma.flashCardSet.create({ data: set }))
  );
}
