import { Tab } from "@headlessui/react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useCallback, useState } from "react";

import { type PanelProps } from "../types";

export const FlashcardsPanel: PanelProps = ({ flashcards }) => {
  const [index, setIndex] = useState(0);
  const flashcard = flashcards[index]!;

  const handleNext = useCallback(() => {
    setIndex((currIndex) =>
      currIndex + 1 > flashcards.length - 1 ? 0 : currIndex + 1
    );
  }, [flashcards.length]);

  const handlePrevious = useCallback(() => {
    setIndex((currIndex) =>
      currIndex - 1 < 0 ? flashcards.length - 1 : currIndex - 1
    );
  }, [flashcards.length]);

  return (
    <Tab.Panel unmount={false}>
      <div className="my-10 mb-5 flex flex-col rounded-3xl bg-blue-200 md:mb-10">
        <div className="flex h-72 flex-col items-center justify-center md:h-96">
          <p className="text-4xl font-bold text-blue-500 md:text-8xl">
            {flashcard.word}
          </p>

          <p className="mt-2 text-xl font-bold text-blue-400 md:text-5xl">
            {flashcard.translation}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handlePrevious}
          className="p-1"
          data-cy="flashcardset-previous"
        >
          <CaretLeft
            className="h-6 w-6 text-slate-950 md:h-8 md:w-8"
            weight="bold"
            aria-hidden="true"
          />
        </button>

        <p
          className="text-xl font-medium text-slate-950 md:text-4xl"
          data-cy="flashcardset-pagination"
        >
          {index + 1} / {flashcards.length}
        </p>

        <button
          onClick={handleNext}
          className="p-1"
          data-cy="flashcardset-next"
        >
          <CaretRight
            className="h-6 w-6 text-slate-950 md:h-8 md:w-8"
            weight="bold"
            aria-hidden="true"
          />
        </button>
      </div>
    </Tab.Panel>
  );
};
