import { useMemo } from "react";

/** Shuffles given list */
export function useShuffledList<T>(arr: T[]) {
  const shuffledList = useMemo(() => {
    const list = [...arr];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j]!, list[i]!];
    }
    return list;
  }, [arr]);
  return shuffledList;
}
