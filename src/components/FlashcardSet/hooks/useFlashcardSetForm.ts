import { useForm } from "~/hooks/useForm";

import { flashcardSetSchema, type FlashcardSet } from "../constants";

export function useFlashcardSetForm(flashcardSet?: Partial<FlashcardSet>) {
  return useForm({
    schema: flashcardSetSchema,
    defaultValues: flashcardSet,
  });
}
