import { useCallback, useMemo, useState } from "react";
import { type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { useForm } from "~/hooks/useForm";
import { useShuffledList } from "~/hooks/useShuffledList";
import { type Flashcard } from "../types";

const answerSchema = z.object({
  answer: z.string().nonempty().trim(),
});

type Id = Flashcard["id"];
type Question =
  | {
      type: "ANSWER";
      data: {
        flashcardId: Id;
        isReversed: boolean;
      };
    }
  | {
      type: "IS_CORRECT_TRANSLATION";
      data: {
        from: Id;
        to: Id;
        isCorrect: boolean;
      };
    }
  | {
      type: "CHOOSE";
      data: {
        correct: Id;
        isReversed: boolean;
        list: [Id, Id, Id, Id];
      };
    };

type QuestionTypes = Question["type"];
type QuestionTypeOptions = Partial<Record<QuestionTypes, boolean>>;

type PracticeOptions = {
  numberOfQuestions: number;
  questionTypes: QuestionTypeOptions;
};

type Answer = {
  answer: string;
  questionId: Id;
  isCorrect: boolean;
};

function useQuestions(flashcards: Flashcard[]) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const shuffledQuestions = useShuffledList(questions);

  const createQuestion = useCallback(
    ({ numberOfQuestions, questionTypes }: PracticeOptions) => {
      const selectedTypes = Object.keys(questionTypes).filter(
        (type) => questionTypes[type as QuestionTypes]
      );
      if (!selectedTypes.length) {
        setQuestions([]);
        return;
      }

      const perType = Math.floor(numberOfQuestions / selectedTypes.length);
      const questionTypesLengths = new Array(selectedTypes.length) as {
        type: QuestionTypes;
        questionsPerType: number;
      }[];
      for (let i = 0; i < selectedTypes.length; i++) {
        questionTypesLengths[i] = {
          type: selectedTypes[i]! as QuestionTypes,
          questionsPerType: perType,
        };
      }

      const sumOfPerType = perType * selectedTypes.length;
      if (sumOfPerType < numberOfQuestions) {
        questionTypesLengths[0]!.questionsPerType +=
          numberOfQuestions - sumOfPerType;
      }

      const newQuestions: Question[] = [];
      questionTypesLengths.forEach(({ questionsPerType, type }) => {
        for (let i = 0; i < questionsPerType; i++) {
          const randomIndex = Math.floor(Math.random() * flashcards.length);

          switch (type) {
            case "ANSWER":
              newQuestions.push({
                type,
                data: {
                  flashcardId: flashcards[randomIndex]!.id,
                  isReversed: Math.random() > 0.5,
                },
              });
              break;
            case "IS_CORRECT_TRANSLATION":
              newQuestions.push({
                type,
                data: {
                  from: flashcards[randomIndex]!.id,
                  to: flashcards[randomIndex]!.id,
                  isCorrect: Math.random() > 0.5,
                },
              });
              break;
            case "CHOOSE":
              const correct = flashcards[randomIndex]!.id;
              // FIXME: not random and could overflow index
              const list = flashcards
                .slice(randomIndex, randomIndex + 3)
                .map((f) => f.id) as [Id, Id, Id, Id];

              newQuestions.push({
                type,
                data: { correct, list, isReversed: Math.random() > 0.5 },
              });
              break;
          }
        }
      });

      setQuestions(newQuestions);
    },
    [flashcards]
  );

  return { questions: shuffledQuestions, createQuestion };
}

type GameState = "START" | "INPROGRESS" | "FINISHED";

export function usePracticeFlashcards(flashcards: Flashcard[]) {
  const [numberOfQuestions, setNumberOfQuestions] = useState(flashcards.length);
  const [questionTypes, setQuestionTypes] = useState<QuestionTypeOptions>({
    ANSWER: false,
    IS_CORRECT_TRANSLATION: false,
    CHOOSE: false,
  });

  const [gameState, setGameState] = useState<GameState>("START");

  const { createQuestion, questions } = useQuestions(flashcards);
  const [index, setIndex] = useState(0);
  const currentQuestion = questions?.[index];

  const { register, handleSubmit, setValue } = useForm({
    schema: answerSchema,
  });

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [correctAnswers, incorrectAnswers] = useMemo(
    () => [
      answers.filter((a) => a.isCorrect).length,
      answers.filter((a) => !a.isCorrect).length,
    ],
    [answers]
  );

  const start = () => {
    if (
      !Object.keys(questionTypes).filter(
        (type) => questionTypes[type as QuestionTypes]!
      ).length
    ) {
      return;
    }

    createQuestion({
      numberOfQuestions,
      questionTypes,
    });
    setGameState("INPROGRESS");
  };

  const handleAnswer: SubmitHandler<{ answer: string }> = ({ answer }) => {
    answer = answer.trim().toLocaleLowerCase();

    if (!currentQuestion) {
      return;
    }

    switch (currentQuestion.type) {
      case "ANSWER": {
        const { flashcardId, isReversed } = currentQuestion.data;

        const questionFlashcard = flashcards.find((f) => f.id === flashcardId)!;

        const isCorrect = isReversed
          ? questionFlashcard.translation.toLocaleLowerCase() === answer
          : questionFlashcard.word.toLocaleLowerCase() === answer;

        setAnswers((prev) => [
          ...prev,
          {
            answer,
            questionId: flashcardId,
            isCorrect,
          },
        ]);
        break;
      }
      case "IS_CORRECT_TRANSLATION": {
        const { isCorrect } = currentQuestion.data;

        if (answer !== "true" && answer !== "false") {
          throw new Error("Answer must be a boolean");
        }

        setAnswers((prev) => [
          ...prev,
          {
            answer,
            questionId: currentQuestion.data.from,
            isCorrect: JSON.parse(answer) === isCorrect,
          },
        ]);
        break;
      }
      case "CHOOSE": {
        const { correct, list } = currentQuestion.data;

        if (!list.includes(answer)) {
          throw new Error("Answer must be in list");
        }

        setAnswers((prev) => [
          ...prev,
          {
            answer,
            questionId: currentQuestion.data.correct,
            isCorrect: answer === correct,
          },
        ]);
        break;
      }
      default:
        throw new Error("Unknown question type");
    }

    setIndex((prevIndex) => prevIndex + 1);
    setValue("answer", "");

    if (index === questions.length - 1) {
      setGameState("FINISHED");
    }
  };

  const reset = () => {
    setAnswers([]);
    setIndex(0);
    setGameState("START");
  };

  return {
    correctAnswers,
    currentQuestion,
    gameState,
    handleSubmit: handleSubmit(handleAnswer),
    incorrectAnswers,
    index,
    numberOfQuestions,
    questions,
    questionTypes,
    register,
    reset,
    setNumberOfQuestions,
    setQuestionTypes,
    start,
  };
}
