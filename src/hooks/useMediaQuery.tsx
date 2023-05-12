import {
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

const Queries = {
  xs: {
    min: 0,
    max: 639,
    classNamesMin: "block",
    classNamesMax: "block sm:hidden",
  },
  sm: {
    min: 640,
    max: 767,
    classNamesMin: "hidden sm:block",
    classNamesMax: "block md:hidden",
  },
  md: {
    min: 768,
    max: 1023,
    classNamesMin: "hidden md:block",
    classNamesMax: "block lg:hidden",
  },
  lg: {
    min: 1024,
    max: 1279,
    classNamesMin: "hidden lg:block",
    classNamesMax: "block xl:hidden",
  },
  xl: {
    min: 1280,
    max: Infinity,
    classNamesMin: "hidden xl:block",
    classNamesMax: "block",
  },
} as const;

type Sizes = keyof typeof Queries;

type Props<T extends keyof JSX.IntrinsicElements = "div"> =
  ComponentProps<T> & {
    as?: T;
    min?: Sizes;
    max?: Sizes;
    children: ReactNode;
  };

export function useMediaQuery(size: Sizes, useMax = false) {
  const { min, max } = Queries[size];
  const mediaQuery = useMax ? `(max-width: ${max}px)` : `(min-width: ${min}px)`;

  // Always render on the server, and depend on classNames to hide it visually:
  const [matches, setMatches] = useState(() =>
    // Always render on the server, and depend on classNames to hide it visually:
    typeof window !== "undefined" ? window.matchMedia(mediaQuery).matches : true
  );

  useEffect(() => {
    const updateMatch = () => setMatches(window.matchMedia(mediaQuery).matches);

    updateMatch();

    window.matchMedia(mediaQuery).addEventListener("change", updateMatch);
    return () => {
      window.matchMedia(mediaQuery).removeEventListener("change", updateMatch);
    };
  }, [mediaQuery]);

  return matches;
}

export default function MediaQuery({
  as: Tag = "div",
  min,
  max,
  children,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (min && max) {
    throw new Error("You cannot use both min and max together");
  }

  if (!min && !max) {
    throw new Error("You must provide either a min or a max.");
  }

  const size = (min ?? max)!;
  const useMax = !!max;

  const { classNamesMin, classNamesMax } = Queries[size];
  const shouldRender = useMediaQuery(size, useMax);

  // Prevent rendering on the server
  if (!mounted) {
    return null;
  }

  return (
    <Tag
      className={useMax ? classNamesMax : classNamesMin}
      suppressHydrationWarning={!shouldRender}
    >
      {shouldRender && children}
    </Tag>
  );
}
