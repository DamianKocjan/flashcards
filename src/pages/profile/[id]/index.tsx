import { useAuth } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { Tab } from "@headlessui/react";
import { cx } from "class-variance-authority";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
  type NextPage,
} from "next";
import Image from "next/image";
import Link from "next/link";

import { HistoryPanel } from "~/components/Profile/Panels/History";
import { MyFlashcardsPanel } from "~/components/Profile/Panels/MyFlashcards";
import { PopularPanel } from "~/components/Profile/Panels/Popular";
import { getUser } from "~/server/api/helpers/userCache";
import { prisma } from "~/server/db";

type Params = {
  id: string;
};
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const ProfilPage: NextPage<Props> = ({ numOfFlashcards, user }) => {
  const { userId } = useAuth();

  const username = user.username || `${user.firstName} ${user.lastName}`;

  return (
    <div>
      <section className="px-8 py-3 sm:px-12 md:px-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-2xl font-semibold text-blue-500">Profile</h2>
          <div className="relative flex h-80 items-center rounded-3xl bg-blue-500 px-6">
            <div className="absolute left-0 top-0 h-44 w-full rounded-3xl bg-blue-400" />

            <header className="z-10 flex w-full items-end">
              <figure className="relative h-44 w-44 rounded-full bg-blue-400 outline outline-offset-2 outline-blue-200">
                <Image
                  src={user.profileImageUrl}
                  alt={`${username} profile picture`}
                  className="rounded-full"
                  fill
                />
              </figure>

              <div className="ml-2 flex-1">
                <h3 className="text-3xl font-bold text-slate-50">{username}</h3>
                <p className="text-lg font-medium text-slate-50">
                  {numOfFlashcards > 0 ? `${numOfFlashcards} Flashcards` : ""}
                </p>
              </div>

              {userId === user.id ? (
                <div className="flex gap-4">
                  <Link
                    href={`/profile/${userId}/manage`}
                    className="rounded-3xl bg-slate-50 px-5 py-3 text-lg font-semibold text-blue-500"
                  >
                    Manage Account
                  </Link>
                  <Link
                    href="/flashcardset/create"
                    className="rounded-3xl bg-slate-50 px-5 py-3 text-lg font-semibold text-blue-500"
                  >
                    Create Flashcard
                  </Link>
                </div>
              ) : null}
            </header>
          </div>
        </div>
      </section>

      <section className="mb-8 px-8 py-3 sm:px-12 md:px-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-2xl font-semibold text-blue-500">
            Flashcards
          </h2>

          <Tab.Group as="div" className="rounded-3xl bg-blue-500 p-6">
            <Tab.List className="flex gap-4">
              <Tab
                className={({ selected }) =>
                  cx(
                    "rounded-3xl px-5 py-3 text-lg font-semibold",
                    selected
                      ? "border border-slate-50 bg-slate-50 text-blue-500"
                      : "border border-slate-50 bg-blue-500 text-slate-50"
                  )
                }
              >
                Popular
              </Tab>
              {userId === user.id ? (
                <>
                  <Tab
                    className={({ selected }) =>
                      cx(
                        "rounded-3xl px-5 py-3 text-lg font-semibold",
                        selected
                          ? "border border-slate-50 bg-slate-50 text-blue-500"
                          : "border border-slate-50 bg-blue-500 text-slate-50"
                      )
                    }
                  >
                    My flashcards
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      cx(
                        "rounded-3xl px-5 py-3 text-lg font-semibold",
                        selected
                          ? "bg-slate-50 text-blue-500"
                          : "border border-slate-50 bg-blue-500 text-slate-50"
                      )
                    }
                  >
                    History
                  </Tab>
                </>
              ) : null}
            </Tab.List>

            <Tab.Panels className="mt-12">
              {({ selectedIndex }) => (
                <>
                  <PopularPanel
                    userId={user.id}
                    isSelected={selectedIndex === 0}
                  />
                  {userId === user.id ? (
                    <>
                      <MyFlashcardsPanel
                        userId={user.id}
                        isSelected={selectedIndex === 1}
                      />
                      <HistoryPanel
                        userId={user.id}
                        isSelected={selectedIndex === 2}
                      />
                    </>
                  ) : null}
                </>
              )}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </section>
    </div>
  );
};

export default ProfilPage;

export const getServerSideProps = async ({
  params,
  req,
}: GetServerSidePropsContext<Params>) => {
  const id = params?.id;
  if (!id) {
    return {
      notFound: true,
    };
  }

  const user = await getUser(id);
  if (!user) {
    return {
      notFound: true,
    };
  }

  const auth = getAuth(req);

  const numOfFlashcards = await prisma.flashCardSet.count({
    where: {
      ownerId: user.id,
      // if the user is not the owner, only show public flashcard sets
      // otherwise show all flashcard sets
      privacy: auth.userId === user.id ? undefined : "PUBLIC",
    },
  });

  return {
    props: {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
      },
      numOfFlashcards,
    },
  };
};
