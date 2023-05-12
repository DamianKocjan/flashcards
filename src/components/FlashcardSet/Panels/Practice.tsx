import { Tab } from "@headlessui/react";
import React from "react";

import { Input } from "~/components/shared/common/Form/Input";
import {
  BIG_NUMBER,
  usePracticeFlashcards,
} from "../hooks/usePracticeFlashcards";
import { type PanelProps } from "../types";

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => {
  return (
    <button
      className="w-full rounded-3xl bg-blue-500 py-3 text-center text-2xl font-semibold text-slate-50 shadow sm:w-52"
      {...props}
    >
      {children}
    </button>
  );
};

export const PracticePanel: PanelProps = ({ flashcards }) => {
  const {
    changeNumberOfQuestions,
    correctAnswers,
    flashcard,
    handleSubmit,
    index,
    isFinished,
    numberOfQuestions,
    register,
    reset,
    startPractice,
  } = usePracticeFlashcards(flashcards);

  return (
    <Tab.Panel unmount={false}>
      <div className="my-10 flex flex-col rounded-3xl bg-blue-200">
        <div className="flex h-96 flex-col items-center justify-center">
          {index === BIG_NUMBER ? (
            <div className="flex flex-col items-center gap-4 p-4">
              <Input
                label="Number of questions"
                type="number"
                value={numberOfQuestions}
                onChange={changeNumberOfQuestions}
                max={flashcards.length - 1}
                min={1}
              />
              <Button onClick={startPractice}>start</Button>
            </div>
          ) : isFinished ? (
            <div className="flex flex-col items-center gap-4 p-4 text-center">
              <h3 className="text-3xl font-bold text-blue-500 md:text-5xl">
                You finished the practice!
              </h3>

              <p className="text-lg font-semibold text-blue-500 md:text-2xl">
                Correct answers: {correctAnswers} out of {numberOfQuestions}
              </p>

              <Button onClick={reset}>Try again</Button>
            </div>
          ) : (
            <form
              className="flex flex-col items-center gap-4 p-4"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={handleSubmit}
            >
              <h3 className="text-5xl font-bold text-blue-500">
                {flashcard.reversed ? flashcard.translation : flashcard.word}
              </h3>

              <Input label="Answer" {...register("answer")} />
              <Button type="submit">Submit</Button>
            </form>
          )}
        </div>

        {index !== BIG_NUMBER && !isFinished ? (
          <div className="flex flex-col-reverse items-center justify-between rounded-3xl bg-blue-500 px-20 py-5 sm:flex-row">
            <p className="text-center font-medium text-slate-50 md:text-lg">
              Correct answers: {correctAnswers} out of {numberOfQuestions}
            </p>
            <p className="text-center text-xl font-bold text-slate-50 md:text-3xl">
              {index + 1} / {numberOfQuestions}
            </p>
          </div>
        ) : null}
      </div>
    </Tab.Panel>
  );
};
