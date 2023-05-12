import { z } from "zod";

export const flashcardSchema = z.object({
  word: z.string().min(1).max(1000),
  translation: z.string().min(1).max(1000),
});
export type Flashcard = z.infer<typeof flashcardSchema>;

export const flashcardSetSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  privacy: z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]),
  categoryId: z.string(),
});
export type FlashcardSet = z.infer<typeof flashcardSetSchema>;

export type PreviewThumbnail = FileReader["result"];

export const MAX_FILE_SIZE = 16 * 1024 * 1024;
