import { useCallback, useMemo, useState } from "react";
import { z } from "zod";

import { useForm } from "~/hooks/useForm";
import { type Flashcard } from "../types";

const answerSchema = z.object({
  answer: z.string().nonempty().trim(),
});

type Id = Flashcard["id"];
type Questions = Record<
  Id,
  {
    answer: string;
    isCorrect: boolean;
    /** If reversed is `true` it means that answer was given to
     * `translation` to `word` instead of `word` to `translation` */
    reversed: boolean;
  }
>;

export const BIG_NUMBER = 999_999_999;

export function usePracticeFlashcards(flashcards: Flashcard[]) {
  const [numberOfQuestions, setNumberOfQuestions] = useState(
    flashcards.length - 1
  );
  const [questions, setQuestions] = useState<Questions>({});
  const [index, setIndex] = useState(BIG_NUMBER);
  const [isFinished, setIsFinished] = useState(false);
  const questionFlashcards = Object.entries(questions).map(
    ([id, { reversed }]) => {
      const flashcard = flashcards.find((f) => f.id === id)!;
      return { ...flashcard, reversed };
    }
  );
  const flashcard = questionFlashcards[index]!;

  const correctAnswers = useMemo(
    () => Object.values(questions).filter((q) => q.isCorrect).length,
    [questions]
  );
  const incorrectAnswers = useMemo(
    () => Object.values(questions).filter((q) => q.isCorrect === false).length,
    [questions]
  );

  const { register, handleSubmit, setValue } = useForm({
    schema: answerSchema,
  });

  const createQuestion = useCallback(() => {
    let newQuestions: Questions = {};
    let i = 0;

    while (i < numberOfQuestions) {
      const randomIndex = Math.floor(Math.random() * flashcards.length);
      const { id } = flashcards[randomIndex]!;
      const reversed = Math.random() > 0.5;

      const question = questions[id];
      if (question && question?.reversed === reversed) continue;

      newQuestions = Object.assign(newQuestions, {
        [id]: {
          answer: "",
          isCorrect: undefined,
          reversed,
        },
      }) as Questions;

      i++;
    }

    setQuestions(newQuestions);
  }, [flashcards, numberOfQuestions, questions]);

  const handleAnswer = useCallback(
    ({ answer }: { answer: string }) => {
      answer = answer.trim().toLocaleLowerCase();

      setQuestions((prev) => {
        const question = prev[flashcard.id]!;
        return {
          ...prev,
          [flashcard.id]: {
            ...question,
            answer,
            isCorrect: question.reversed
              ? answer === flashcard.word.toLocaleLowerCase()
              : answer === flashcard.translation.toLocaleLowerCase(),
          },
        } as Questions;
      });
      setIndex((prevIndex) => {
        function finish() {
          setIsFinished(true);
          return prevIndex;
        }
        return prevIndex < questionFlashcards.length - 1
          ? prevIndex + 1
          : finish();
      });
      setValue("answer", "");
    },
    [flashcard, questionFlashcards.length, setValue]
  );

  const changeNumberOfQuestions = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      if (value > flashcards.length) return;
      setNumberOfQuestions(value);
    },
    [flashcards.length]
  );

  const startPractice = useCallback(() => {
    createQuestion();
    setIndex(0);
  }, [createQuestion]);

  const reset = useCallback(() => {
    setIndex(BIG_NUMBER);
    setIsFinished(false);
    setQuestions({});
  }, []);

  return {
    changeNumberOfQuestions,
    correctAnswers,
    flashcard,
    handleSubmit: handleSubmit(handleAnswer),
    incorrectAnswers,
    index,
    isFinished,
    numberOfQuestions,
    questions,
    register,
    reset,
    startPractice,
  };
}
