import { type RouterOutputs } from "~/utils/api";

export type Flashcard = RouterOutputs["flashcard"]["get"]["flashCards"][number];

export type PanelProps = React.FC<{
  flashcards: Flashcard[];
}>;
