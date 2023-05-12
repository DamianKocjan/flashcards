import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { SignIn } from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";

export const Nav: React.FC = () => {
  const { user, isSignedIn } = useUser();

  return (
    <nav className="flex h-24 items-center bg-blue-500 px-8 text-slate-50 lg:px-20">
      <div className="mx-auto flex w-full max-w-7xl items-center">
        <h1 className="text-2xl font-bold drop-shadow md:text-3xl">
          <Link href={isSignedIn ? "/home" : "/"}>Flashcards</Link>
        </h1>
        <div className="flex-1" />
        <ul className="flex items-center gap-2 md:gap-4">
          <SignedIn>
            <li>
              <Link href={`/profile/${user?.id || ""}`} className="md:text-lg">
                Profile
              </Link>
            </li>
            <li>
              {/* <AccountMenu /> */}
              <UserButton
                userProfileUrl={`/profile/${user?.id || ""}/manage`}
                signInUrl="/sign-in"
                userProfileMode="navigation"
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-10 w-10 md:h-12 md:w-12",
                  },
                }}
              />
            </li>
          </SignedIn>
          <SignedOut>
            <li>
              <Link href="/sign-in">
                <span className="sr-only">Login</span>
                <SignIn className="h-11 w-11" aria-hidden="true" />
              </Link>
            </li>
          </SignedOut>
        </ul>
      </div>
    </nav>
  );
};
