import { useCallback, useState } from "react";

import { useForm } from "~/hooks/useForm";
import { flashcardSchema, type Flashcard } from "../constants";

type FlashcardWithId = Flashcard & { id: string };

export function useFlashcardSet(originalFlashcards: FlashcardWithId[] = []) {
  const [flashcards, setFlashcards] =
    useState<(Flashcard | FlashcardWithId)[]>(originalFlashcards);
  const [editingFlashcardIndex, setEditingFlashcardIndex] = useState(-1);

  const { handleSubmit, register, setValue, setFocus, setError } = useForm({
    schema: flashcardSchema,
  });

  /** Check if flashcard with given word already exists */
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

  /** Start editing flashcard with given index
   * Sets form values to flashcard values
   */
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
    (data: Flashcard | FlashcardWithId) => {
      if (!flashcards[editingFlashcardIndex]) {
        return;
      }

      if (checkIfFlashcardExists(data.word)) {
        setError("word", {
          type: "manual",
          message: "Flashcard with this word already exists",
        });
        return;
      }

      setFlashcards((prev) =>
        prev.map((flashcard, index) =>
          index === editingFlashcardIndex
            ? Object.assign(flashcard, data)
            : flashcard
        )
      );

      setEditingFlashcardIndex(-1);
      setValue("word", "");
      setValue("translation", "");
    },
    [
      checkIfFlashcardExists,
      editingFlashcardIndex,
      flashcards,
      setError,
      setValue,
    ]
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
