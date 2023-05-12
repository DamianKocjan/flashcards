import React from "react";

type Props = {
  error: string;
};

export const Error: React.FC<Props> = ({ error }) => {
  return (
    <div className="flex items-center justify-center">
      <p className="text-2xl text-neutral-500">Something went wrong</p>
      <p className="text-2xl text-neutral-500">{error}</p>
    </div>
  );
};
