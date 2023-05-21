import { Tab } from "@headlessui/react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";

import { useShuffledList } from "~/hooks/useShuffledList";
import { type PanelProps } from "../types";

export const LearnPanel: PanelProps = ({ flashcards }) => {
  const shuffled = useShuffledList(flashcards);
  const [index, setIndex] = useState(0);
  const flashcard = shuffled[index]!;
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = useCallback(() => {
    setIndex((currIndex) =>
      currIndex + 1 > flashcards.length - 1 ? 0 : currIndex + 1
    );
    setIsFlipped(false);
  }, [flashcards.length]);

  const handlePrevious = useCallback(() => {
    setIndex((currIndex) =>
      currIndex - 1 < 0 ? flashcards.length - 1 : currIndex - 1
    );
    setIsFlipped(false);
  }, [flashcards.length]);

  const toggleTranslation = useCallback(() => {
    setIsFlipped((currIsFlipped) => !currIsFlipped);
  }, []);

  return (
    <Tab.Panel unmount={false}>
      <div className="my-10 mb-5 flex flex-col rounded-3xl bg-blue-200 md:mb-10">
        <div
          className="flex h-72 cursor-pointer items-center justify-center md:h-96"
          onClick={toggleTranslation}
        >
          {/* TODO: better rotation animation */}
          <motion.p
            key={`${flashcard.id}-${String(isFlipped)}`}
            initial={{ rotateX: 80, scale: 0.7 }}
            animate={{ rotateX: 0, scale: 1 }}
            exit={{ rotateX: 80, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="select-none text-4xl font-bold text-blue-400 md:text-8xl"
            data-cy="flashcardset-word"
          >
            {isFlipped ? flashcard.translation : flashcard.word}
          </motion.p>
        </div>

        <div className="rounded-3xl bg-blue-500 py-3 md:py-5">
          <p className="text-center text-xl font-medium text-blue-50 md:text-4xl">
            Click on the card to see the definition!
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={handlePrevious} className="p-1">
          <CaretLeft
            className="h-6 w-6 text-slate-950 md:h-8 md:w-8"
            weight="bold"
            aria-hidden="true"
          />
        </button>

        <p className="text-xl font-medium text-slate-950 md:text-4xl">
          {index + 1} / {flashcards.length}
        </p>

        <button onClick={handleNext} className="p-1">
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
