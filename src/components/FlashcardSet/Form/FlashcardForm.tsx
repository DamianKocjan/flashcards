import { type UseFormRegister } from "react-hook-form";

import { Input } from "~/components/shared/common/Form/Input";
import { type Flashcard } from "../constants";

type Props = {
  editingIndex: number;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<Flashcard>;
};

export const FlashcardForm: React.FC<Props> = ({
  editingIndex,
  onSubmit,
  register,
}) => {
  return (
    <form
      className="flex w-full flex-col gap-2 rounded-2xl bg-blue-100 p-2 shadow"
      onSubmit={onSubmit}
    >
      <Input
        type="text"
        label="Word"
        placeholder="Word"
        {...register("word", { required: true })}
        data-cy="input-word"
      />
      <Input
        type="text"
        label="Translation"
        placeholder="Your translation..."
        {...register("translation", { required: true })}
        data-cy="input-translation"
      />

      <button
        type="submit"
        className="rounded-2xl border border-blue-500 bg-blue-200 py-4 text-xl font-bold uppercase text-blue-500"
        data-cy="button-submit-flashcard"
      >
        {editingIndex !== -1 ? "Update flashcard" : "Add flashcard"}
      </button>
    </form>
  );
};
