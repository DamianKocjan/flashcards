import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
  type NextPage,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useId, useState } from "react";
import { FormProvider } from "react-hook-form";

import { useFlashcardSet } from "~/components/FlashcardSet/Edit/useFlashcardSet";
import { CategoryInput } from "~/components/FlashcardSet/Form/CategoryInput";
import { Flashcard } from "~/components/FlashcardSet/Form/Flashcard";
import { FlashcardForm } from "~/components/FlashcardSet/Form/FlashcardForm";
import { PrivacyInput } from "~/components/FlashcardSet/Form/PrivacyInput";
import { ThumbnailInput } from "~/components/FlashcardSet/Form/ThumbnailInput";
import { type FlashcardSet } from "~/components/FlashcardSet/constants";
import { useFlashcardSetForm } from "~/components/FlashcardSet/hooks/useFlashcardSetForm";
import { useThumbnail } from "~/components/FlashcardSet/hooks/useThumbnail";
import { Input } from "~/components/shared/common/Form/Input";
import { getUser } from "~/server/api/helpers/userCache";
import { prisma } from "~/server/db";
import { type OurFileRouter, type Upload } from "~/server/uploadthing";
import { api, type RouterInputs } from "~/utils/api";

const { uploadFiles } = generateReactHelpers<OurFileRouter>();

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const FlashcardSetEditPage: NextPage<Props> = ({ categories, set }) => {
  const [error, setError] = useState<string>("");
  const formId = useId();

  const {
    getInputProps,
    getRootProps,
    handleRemoveThumbnail,
    previewThumbnail,
    thumbnail,
  } = useThumbnail(set.thumbnail);

  const form = useFlashcardSetForm({
    name: set.name,
    description: set.description,
    privacy: set.privacy,
    categoryId: set.category.id,
  });
  const {
    editingFlashcardIndex,
    flashcards,
    handleCreate,
    handleEdit,
    handleRemove,
    handleStartEdit,
    handleSubmitFlashcard,
    registerFlashcard,
  } = useFlashcardSet(set.flashCards);

  const router = useRouter();
  const id = router.query.id as string;
  const { mutateAsync } = api.flashcard.update.useMutation();

  const handleSubmitFlashcardSet = useCallback(
    async ({ categoryId, description, name, privacy }: FlashcardSet) => {
      try {
        if (!flashcards.length) throw new Error("Flashcards are required");

        let uploadedThumbnailUrl: string | undefined;
        if (thumbnail) {
          const uploadedFiles = (await uploadFiles(
            [thumbnail],
            "thumbnailUploader"
          )) as Upload[];

          uploadedThumbnailUrl = uploadedFiles[0]?.fileUrl;
          if (!uploadedThumbnailUrl) throw new Error("Something went wrong");
        }

        const modifiedFlashcards = flashcards.filter((flashcard) => {
          if (!("id" in flashcard)) return true;
          return !set.flashCards.includes(flashcard);
        });

        const data: RouterInputs["flashcard"]["update"] = {
          id,
          flashcards: modifiedFlashcards,
        };
        if (set.name !== name) data.name = name;
        if (set.description !== description) data.description = description;
        if (set.privacy !== privacy) data.privacy = privacy;
        if (set.category.id !== categoryId) data.categoryId = categoryId;
        if (set.thumbnail !== uploadedThumbnailUrl)
          data.thumbnail = uploadedThumbnailUrl;

        await mutateAsync(data);

        await router.push(`/flashcardset/${id}`);
      } catch (error) {
        console.error(error);

        if (error instanceof Error)
          setError(error?.message || String(error) || "Something went wrong");
      }
    },
    [flashcards, id, mutateAsync, set, router, thumbnail]
  );

  return (
    <div className="p-8 pt-16 sm:px-12 md:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-500 md:text-4xl">
            Update Flashcard Set -{" "}
            <Link className="underline" href={`/flashcardset/${set.id}`}>
              {set.name}
            </Link>
          </h2>

          <FormProvider {...form}>
            <PrivacyInput />
          </FormProvider>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row">
          <FormProvider {...form}>
            <form
              className="flex w-full flex-col gap-2"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={form.handleSubmit(handleSubmitFlashcardSet)}
              id={formId}
            >
              {error && <p className="text-red-500">{error}</p>}

              <Input
                type="text"
                label="Name"
                placeholder="Name"
                {...form.register("name", { required: true })}
                data-cy="input-name"
              />
              <Input
                type="text"
                label="Description"
                placeholder="Description"
                {...form.register("description", { required: true })}
                data-cy="input-description"
              />

              <CategoryInput categories={categories} />
              <ThumbnailInput
                getInputProps={getInputProps}
                getRootProps={getRootProps}
                handleRemoveThumbnail={handleRemoveThumbnail}
                previewThumbnail={previewThumbnail}
              />
            </form>
          </FormProvider>

          <div className="flex w-full flex-col gap-2">
            <FlashcardForm
              editingIndex={editingFlashcardIndex}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={handleSubmitFlashcard(
                editingFlashcardIndex !== -1 ? handleEdit : handleCreate
              )}
              register={registerFlashcard}
            />
            <input
              type="submit"
              className="mt-auto cursor-pointer rounded-2xl bg-blue-500 py-3 text-xl font-bold uppercase text-slate-50"
              value="Update"
              form={formId}
              disabled={form.formState.isSubmitting || !form.formState.isValid}
              title={
                !form.formState.isValid
                  ? "Please fill out all the fields"
                  : undefined
              }
              data-cy="button-submit-flashcardset"
            />
          </div>
        </div>

        {flashcards.length ? (
          <div
            className="mb-4 mt-14 grid grid-cols-4 justify-items-stretch gap-3"
            data-cy="flashcard-list"
          >
            {flashcards.map((flashcard, i) => (
              <Flashcard
                key={i}
                {...flashcard}
                index={i}
                onEdit={() => handleStartEdit(i)}
                onRemove={() => handleRemove(i)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FlashcardSetEditPage;

export const getServerSideProps = async ({
  params,
  req,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { id } = params as { id: string };

  const { userId, user } = getAuth(req);
  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in?redirect_url=" + resolvedUrl,
        permanent: false,
      },
    };
  }

  const set = await prisma.flashCardSet.findUnique({
    where: { id },
    select: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      description: true,
      flashCards: {
        select: {
          id: true,
          translation: true,
          word: true,
        },
      },
      id: true,
      name: true,
      ownerId: true,
      privacy: true,
      thumbnail: true,
    },
  });
  if (!set) {
    return {
      notFound: true,
    };
  }

  type Owner = {
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string;
  };

  let owner: Owner;
  if (user && set.ownerId === userId) {
    owner = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
    };
  } else {
    owner = (await getUser(set.ownerId))!;
  }

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return {
    props: {
      ...buildClerkProps(req),
      set: {
        ...set,
        owner,
      },
      categories,
    },
  };
};
