import Link from "next/link";
import React from "react";

export type Props = {
  owner: {
    username: string | null | undefined;
    firstName: string | null | undefined;
    lastName: string | null | undefined;
    profileImageUrl: string | undefined;
  };
  id: string;
  _count: {
    flashCards: number;
  };
  name: string;
  category: {
    id: string;
    name: string;
  };
  thumbnail: string | null;
  ownerId: string;
};

export const FlashcardSet: React.FC<Props> = ({
  owner,
  id,
  _count,
  name,
  category,
  thumbnail,
  ownerId,
}) => {
  const username =
    owner.username || `${owner.firstName ?? ""} ${owner.lastName ?? ""}`;

  return (
    <div className="group relative aspect-[16/10] w-full rounded-3xl bg-slate-50 shadow transition-[background-size] lg:w-96">
      <div
        style={{
          background: `url(${thumbnail ?? ""}) 50%`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="absolute inset-0 rounded-3xl"
      >
        <div className="absolute inset-0 rounded-3xl bg-black bg-opacity-0 transition-all group-hover:bg-opacity-20 group-hover:backdrop-blur-sm" />
      </div>

      <Link
        href={`/flashcardset/${id}`}
        className="absolute inset-0 flex items-center justify-center rounded-3xl"
      >
        <div className="text-center text-slate-50 drop-shadow">
          <h3 className="text-4xl font-semibold">{name}</h3>

          <p className="mt-2 text-lg">
            <Link href={`/profile/${ownerId}`}>{username}</Link>
          </p>

          <div className="-translate-y-full scale-y-0 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:scale-y-100 group-hover:opacity-100">
            <p className="flex items-center justify-center text-lg">
              <br />
              {category.name}{" "}
              <span className="mx-1 block h-1 w-1 rounded-full bg-slate-50" />{" "}
              {_count.flashCards} Flashcards
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export const FlashcardSetSkeleton: React.FC = () => {
  return (
    <div className="flex aspect-[16/10] w-full animate-pulse items-center justify-center rounded-3xl bg-slate-50 shadow lg:w-96">
      <p className="select-none text-center text-xl font-semibold text-blue-400">
        Loading...
      </p>
    </div>
  );
};
