import React from "react";

export const Banner: React.FC = () => {
  return (
    <div className="flex min-h-[3rem] items-center bg-blue-400 px-8 py-2 sm:px-12 sm:py-0 md:px-20">
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-xl font-semibold text-slate-50">
          Join us and become an expert! Register now by clicking the button.
        </p>
      </div>
    </div>
  );
};
