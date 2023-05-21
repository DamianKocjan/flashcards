import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export const Footer: React.FC = () => {
  const { isSignedIn } = useAuth();

  return (
    <footer className="bg-blue-500 p-8 sm:px-12 md:px-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:gap-0">
        <div className="flex-1 text-slate-50">
          <h2 className="text-3xl font-bold drop-shadow">Flashcardz</h2>
          <p className="mt-1 text-xl font-semibold">
            <a href="mailto:Info@flashcardz.edu">Info@flashcardz.edu</a>
            <br />
            Copyright &copy;{new Date().getFullYear()} Flashcardz,
            <br />
            Designed by{" "}
            <a href="https://github.com/Foorty7even" target="_blank">
              Kacper Gumieniak
            </a>
            , Developed by{" "}
            <a href="https://github.com/DamianKocjan" target="_blank">
              Damian Kocjan
            </a>
          </p>
        </div>
        <div>
          {!isSignedIn ? (
            <Link
              href="/sign-in"
              className="block rounded-3xl bg-slate-50 px-8 py-4 text-center text-xl font-semibold text-blue-500 shadow"
            >
              Get Started
            </Link>
          ) : null}
        </div>
      </div>
    </footer>
  );
};
