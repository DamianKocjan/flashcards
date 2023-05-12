import { Pencil, X } from "@phosphor-icons/react";

import { type Flashcard as _FlashCard } from "../constants";

type Props = _FlashCard & {
  index: number;
  onEdit: () => void;
  onRemove: () => void;
};
export const Flashcard: React.FC<Props> = ({
  index,
  word,
  translation,
  onEdit,
  onRemove,
}) => {
  return (
    <div className="relative flex h-[200px] w-[300px] flex-col gap-2 rounded-2xl border border-blue-500 bg-blue-200 px-3 py-4 text-blue-500">
      <div className="absolute right-3 top-4 flex gap-2">
        <button onClick={onEdit}>
          <Pencil className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Update flashcard</span>
        </button>
        <button onClick={onRemove}>
          <X className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Remove flashcard</span>
        </button>
      </div>

      <h3>Flascard #{index + 1}</h3>

      <div className="flex flex-col gap-2">
        <div className="">
          <h4 className="text-xs font-medium">Word</h4>
          <p className="text-2xl font-medium">{word}</p>
        </div>
        <div className="">
          <h4 className="text-xs font-medium">Translation</h4>
          <p className="text-2xl font-medium">{translation}</p>
        </div>
      </div>
    </div>
  );
};
