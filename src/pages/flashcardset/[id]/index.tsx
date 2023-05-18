import { SignedIn, useAuth } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { Tab } from "@headlessui/react";
import { Cards, Student, Target, type IconProps } from "@phosphor-icons/react";
import { cx } from "class-variance-authority";
import { type GetServerSidePropsContext, type NextPage } from "next";
import { useRouter } from "next/router";

import { ManageSet } from "~/components/FlashcardSet/ManageSet";
import { FlashcardsPanel } from "~/components/FlashcardSet/Panels/Flashcards";
import { LearnPanel } from "~/components/FlashcardSet/Panels/Learn";
import { PracticePanel } from "~/components/FlashcardSet/Panels/Practice";
import MediaQuery from "~/hooks/useMediaQuery";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

// type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const TabSelector: React.FC<{
  name: string;
  icon: React.FC<IconProps>;
  isSelected: boolean;
}> = ({ icon: Icon, name, isSelected }) => {
  return (
    <Tab
      className={cx(
        "flex flex-col items-center justify-center gap-2 font-semibold text-slate-50 md:flex-row md:text-xl",
        isSelected ? "underline" : ""
      )}
    >
      <Icon
        className="h-10 w-10 md:h-6 md:w-6"
        weight={isSelected ? "fill" : undefined}
      />
      <span>{name}</span>
    </Tab>
  );
};

const FlashcardSetPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data, isLoading, isError } = api.flashcard.get.useQuery(id, {
    refetchOnWindowFocus: false,
  });
  const { userId } = useAuth();

  if (isLoading || isError || !data) {
    return null;
  }
  return (
    <section className="px-8 py-3 sm:px-12 md:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <h2 className="my-10 text-4xl font-bold text-blue-500">
            {data?.category.name} - {data?.name}
          </h2>

          <SignedIn>
            <MediaQuery max="sm">
              <ManageSet id={data.id} userId={userId!} ownerId={data.ownerId} />
            </MediaQuery>
          </SignedIn>
        </div>
        <Tab.Group>
          <div className="flex items-center justify-between">
            <Tab.List className="flex w-full justify-between rounded-3xl bg-blue-500 px-10 py-5 text-slate-50 md:w-2/3 md:justify-center md:gap-11 md:px-32">
              {({ selectedIndex }) => (
                <>
                  <TabSelector
                    name="Flashcards"
                    icon={Cards}
                    isSelected={selectedIndex === 0}
                  />
                  <TabSelector
                    name="Learn"
                    icon={Student}
                    isSelected={selectedIndex === 1}
                  />
                  <TabSelector
                    name="Practice"
                    icon={Target}
                    isSelected={selectedIndex === 2}
                  />
                </>
              )}
            </Tab.List>

            <SignedIn>
              <MediaQuery min="md">
                <ManageSet
                  id={data.id}
                  userId={userId!}
                  ownerId={data.ownerId}
                />
              </MediaQuery>
            </SignedIn>
          </div>
          <Tab.Panels className="pb-4">
            <FlashcardsPanel flashcards={data.flashCards} />
            <LearnPanel flashcards={data.flashCards} />
            <PracticePanel flashcards={data.flashCards} />
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  );
};

export default FlashcardSetPage;

export async function getServerSideProps({
  params,
  req,
  resolvedUrl,
}: GetServerSidePropsContext<{ id: string }>) {
  const id = params?.id;
  if (!id) {
    return {
      notFound: true,
    };
  }
  const set = await prisma.flashCardSet.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      ownerId: true,
      privacy: true,
    },
  });
  if (!set) {
    return {
      notFound: true,
    };
  }

  const { userId } = getAuth(req);

  if (set.privacy === "PRIVATE" && set.ownerId !== userId) {
    return {
      notFound: true,
    };
  }

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in?redirect_url=" + resolvedUrl,
        permanent: false,
      },
    };
  }

  const ONE_HOUR = 3600_000;
  const WITHIN_LAST_24_HOURS = new Date(Date.now() - 24 * ONE_HOUR);
  const lastTimeOpened = await prisma.history.findFirst({
    where: {
      userId,
      setId: id,
      createdAt: {
        gte: WITHIN_LAST_24_HOURS,
      },
    },
    select: {
      id: true,
    },
  });

  if (!lastTimeOpened) {
    await prisma.history.create({
      data: {
        userId,
        setId: id,
      },
    });
  } else {
    await prisma.history.update({
      where: {
        id: lastTimeOpened.id,
      },
      data: {
        updatedAt: new Date(),
      },
    });
  }

  return {
    props: {},
  };
}

// export async function getServerSideProps({
//   params,
//   req,
// }: GetServerSidePropsContext<{ id: string }>) {
//   const id = params?.id;
//   if (!id) {
//     return {
//       notFound: true,
//     };
//   }

//   const set = await prisma.flashCardSet.findUnique({
//     where: {
//       id,
//     },
//     select: {
//       id: true,
//       name: true,
//       description: true,
//       thumbnail: true,
//       privacy: true,
//       ownerId: true,
//       category: {
//         select: {
//           id: true,
//           name: true,
//         },
//       },
//       flashCards: {
//         select: {
//           id: true,
//           word: true,
//           translation: true,
//         },
//       },
//     },
//   });
//   if (!set) {
//     return {
//       notFound: true,
//     };
//   }

//   let owner: {
//     username: string;
//     firstName: string;
//     lastName: string;
//     profileImageUrl: string;
//   };

//   const { userId, user } = getAuth(req);
//   const isOwner = userId === set.ownerId;
//   if (user && isOwner) {
//     owner = {
//       username: user.username ?? "",
//       firstName: user.firstName ?? "",
//       lastName: user.lastName ?? "",
//       profileImageUrl: user.profileImageUrl,
//     };
//   } else {
//     const ownerData = await clerkClient.users.getUser(set.ownerId);
//     owner = {
//       username: ownerData.username ?? "",
//       firstName: ownerData.firstName ?? "",
//       lastName: ownerData.lastName ?? "",
//       profileImageUrl: ownerData.profileImageUrl,
//     };
//   }

//   return {
//     props: {
//       ...buildClerkProps(req),
//       set: {
//         ...set,
//         owner,
//       },
//       isLoggedIn: !!userId,
//       isOwner,
//     },
//   };
// }
