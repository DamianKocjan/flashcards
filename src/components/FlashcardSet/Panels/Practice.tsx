import { Tab } from "@headlessui/react";
import { cx } from "class-variance-authority";
import React from "react";

import { Input } from "~/components/shared/common/Form/Input";
import { usePracticeFlashcards } from "../hooks/usePracticeFlashcards";
import { type PanelProps } from "../types";

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={cx(
        "w-full rounded-3xl bg-blue-500 py-3 text-center text-2xl font-semibold text-slate-50 shadow sm:w-52",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// TODO: UI
export const PracticePanel: PanelProps = ({ flashcards }) => {
  const {
    correctAnswers,
    currentQuestion,
    gameState,
    handleSubmit,
    index,
    numberOfQuestions,
    questionTypes,
    register,
    reset,
    setNumberOfQuestions,
    setQuestionTypes,
    start,
  } = usePracticeFlashcards(flashcards);

  return (
    <Tab.Panel unmount={false}>
      <div className="my-10 flex flex-col rounded-3xl bg-blue-200">
        <div className="relative flex h-96 flex-col items-center justify-center">
          {gameState !== "START" ? (
            <Button className="absolute right-4 top-4" onClick={reset}>
              Reset
            </Button>
          ) : null}

          {gameState === "START" ? (
            <div className="flex flex-col items-center gap-4 p-4">
              <Input
                label="ANSWER"
                type="checkbox"
                checked={questionTypes.ANSWER}
                onChange={(e) =>
                  setQuestionTypes((prev) => ({
                    ...prev,
                    ANSWER: e.target.checked,
                  }))
                }
              />
              <Input
                label="CHOOSE"
                type="checkbox"
                checked={questionTypes.CHOOSE}
                onChange={(e) =>
                  setQuestionTypes((prev) => ({
                    ...prev,
                    CHOOSE: e.target.checked,
                  }))
                }
              />
              <Input
                label="IS_CORRECT_TRANSLATION"
                type="checkbox"
                checked={questionTypes.IS_CORRECT_TRANSLATION}
                onChange={(e) =>
                  setQuestionTypes((prev) => ({
                    ...prev,
                    IS_CORRECT_TRANSLATION: e.target.checked,
                  }))
                }
              />

              <Input
                label="Number of questions"
                type="number"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                max={flashcards.length - 1}
                min={1}
              />
              <Button onClick={start}>start</Button>
            </div>
          ) : gameState === "FINISHED" ? (
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
              {currentQuestion?.type === "ANSWER" ? (
                <>
                  <h3 className="text-5xl font-bold text-blue-500">
                    {currentQuestion.data.isReversed
                      ? flashcards.find(
                          (f) => f.id === currentQuestion.data.flashcardId
                        )!.translation
                      : flashcards.find(
                          (f) => f.id === currentQuestion.data.flashcardId
                        )!.word}
                  </h3>

                  <Input label="Answer" {...register("answer")} />
                  <Button type="submit">Submit</Button>
                </>
              ) : currentQuestion?.type === "CHOOSE" ? (
                <>
                  <h3 className="text-5xl font-bold text-blue-500">
                    {currentQuestion.data.isReversed
                      ? flashcards.find(
                          (f) => f.id === currentQuestion.data.correct
                        )?.word
                      : flashcards.find(
                          (f) => f.id === currentQuestion.data.correct
                        )?.translation}
                  </h3>

                  <div className="flex flex-col gap-4">
                    {currentQuestion.data.list.map((id) => (
                      <Input
                        key={id}
                        type="radio"
                        label={
                          currentQuestion.data.isReversed
                            ? flashcards.find((f) => f.id === id)!.translation
                            : flashcards.find((f) => f.id === id)!.word
                        }
                        {...register("answer")}
                        value={id}
                      />
                    ))}
                  </div>

                  <Button type="submit">Submit</Button>
                </>
              ) : currentQuestion?.type === "IS_CORRECT_TRANSLATION" ? (
                <>
                  <h3 className="text-5xl font-bold text-blue-500">
                    {
                      flashcards.find(
                        (f) => f.id === currentQuestion.data.from
                      )!.word
                    }
                  </h3>
                  <h3 className="text-5xl font-bold text-blue-500">
                    {
                      flashcards.find((f) => f.id === currentQuestion.data.to)!
                        .translation
                    }
                  </h3>

                  <div className="flex flex-col gap-4">
                    <Input
                      type="radio"
                      label="Correct"
                      {...register("answer")}
                      value="true"
                    />
                    <Input
                      type="radio"
                      label="Incorrect"
                      {...register("answer")}
                      value="false"
                    />
                  </div>

                  <Button type="submit">Submit</Button>
                </>
              ) : null}
            </form>
          )}
        </div>

        {gameState === "INPROGRESS" ? (
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
