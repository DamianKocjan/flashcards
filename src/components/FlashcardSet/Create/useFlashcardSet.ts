import { useCallback, useState } from "react";

import { useForm } from "~/hooks/useForm";
import { flashcardSchema, type Flashcard } from "../constants";

export function useFlashcardSet() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [editingFlashcardIndex, setEditingFlashcardIndex] = useState(-1);

  const { handleSubmit, register, setValue, setFocus, setError } = useForm({
    schema: flashcardSchema,
  });

  const checkIfFlashcardExists = useCallback(
    (word: string) => {
      return !!flashcards.find((flashcard) => flashcard.word === word);
    },
    [flashcards]
  );

  const handleCreate = useCallback(
    (data: Flashcard) => {
      if (checkIfFlashcardExists(data.word)) {
        setError("word", {
          type: "manual",
          message: "Flashcard with this word already exists",
        });
        return;
      }

      setFlashcards((prev) => [...prev, data]);

      setValue("word", "");
      setValue("translation", "");
      setFocus("word");
    },
    [checkIfFlashcardExists, setError, setFocus, setValue]
  );

  const handleRemove = useCallback((index: number) => {
    setFlashcards((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleStartEdit = useCallback(
    (index: number) => {
      const flashcard = flashcards[index];
      if (!flashcard) {
        return;
      }

      setEditingFlashcardIndex(index);
      setValue("word", flashcard.word);
      setValue("translation", flashcard.translation);
    },
    [flashcards, setValue]
  );

  const handleEdit = useCallback(
    (data: Flashcard) => {
      if (!flashcards[editingFlashcardIndex]) {
        return;
      }

      // NOTE: This is not needed because it is used as 'cancel'
      // if (checkIfFlashcardExists(data.word)) {
      //   setError("word", {
      //     type: "manual",
      //     message: "Flashcard with this word already exists",
      //   });
      //   return;
      // }

      setFlashcards((prev) =>
        prev.map((flashcard, index) =>
          index === editingFlashcardIndex ? data : flashcard
        )
      );

      setEditingFlashcardIndex(-1);
      setValue("word", "");
      setValue("translation", "");
    },
    [editingFlashcardIndex, flashcards, setValue]
  );

  return {
    editingFlashcardIndex,
    flashcards,
    handleCreate,
    handleEdit,
    handleRemove,
    handleStartEdit,
    handleSubmitFlashcard: handleSubmit,
    registerFlashcard: register,
  };
}
