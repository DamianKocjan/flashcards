import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
  type NextPage,
} from "next";
import { useRouter } from "next/router";
import { useCallback, useId, useState } from "react";
import { FormProvider } from "react-hook-form";

import { useFlashcardSet } from "~/components/FlashcardSet/Create/useFlashcardSet";
import { CategoryInput } from "~/components/FlashcardSet/Form/CategoryInput";
import { Flashcard } from "~/components/FlashcardSet/Form/Flashcard";
import { FlashcardForm } from "~/components/FlashcardSet/Form/FlashcardForm";
import { PrivacyInput } from "~/components/FlashcardSet/Form/PrivacyInput";
import { ThumbnailInput } from "~/components/FlashcardSet/Form/ThumbnailInput";
import { type FlashcardSet } from "~/components/FlashcardSet/constants";
import { useFlashcardSetForm } from "~/components/FlashcardSet/hooks/useFlashcardSetForm";
import { useThumbnail } from "~/components/FlashcardSet/hooks/useThumbnail";
import { Input } from "~/components/shared/common/Form/Input";
import { prisma } from "~/server/db";
import { type OurFileRouter, type Upload } from "~/server/uploadthing";
import { api } from "~/utils/api";

const { uploadFiles } = generateReactHelpers<OurFileRouter>();

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const FlashcardSetCreate: NextPage<Props> = ({ categories }) => {
  const [error, setError] = useState<string>("");
  const id = useId();

  const {
    getInputProps,
    getRootProps,
    handleRemoveThumbnail,
    previewThumbnail,
    thumbnail,
  } = useThumbnail();

  const form = useFlashcardSetForm({ privacy: "PUBLIC" });
  const {
    editingFlashcardIndex,
    flashcards,
    handleCreate,
    handleEdit,
    handleRemove,
    handleStartEdit,
    handleSubmitFlashcard,
    registerFlashcard,
  } = useFlashcardSet();

  const router = useRouter();
  const { mutateAsync } = api.flashcard.create.useMutation();

  const handleSubmitFlashcardSet = useCallback(
    async ({ categoryId, description, name, privacy }: FlashcardSet) => {
      try {
        if (!thumbnail) throw new Error("Thumbnail is required");
        if (!flashcards.length) throw new Error("Flashcards are required");

        const uploadedFiles = (await uploadFiles(
          [thumbnail],
          "thumbnailUploader"
        )) as Upload[];

        const uploadedThumbnailUrl = uploadedFiles[0]?.fileUrl;
        if (!uploadedThumbnailUrl) throw new Error("Something went wrong");

        const { id } = await mutateAsync({
          categoryId,
          description,
          flashcards,
          name,
          privacy,
          thumbnail: uploadedThumbnailUrl,
        });

        await router.push(`/flashcardset/${id}`);
      } catch (error) {
        console.error(error);

        if (error instanceof Error)
          setError(error?.message || String(error) || "Something went wrong");
      }
    },
    [flashcards, mutateAsync, router, thumbnail]
  );

  return (
    <div className="p-8 pt-16 sm:px-12 md:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-500 md:text-4xl">
            Create your own set
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
              id={id}
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
              value="Create"
              form={id}
              data-cy="button-submit-flashcardset"
            />
          </div>
        </div>

        {flashcards.length ? (
          <div className="mb-4 mt-14 grid grid-cols-4 justify-items-stretch gap-3">
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

export default FlashcardSetCreate;

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in?redirect_url=" + resolvedUrl,
        permanent: false,
      },
    };
  }

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return { props: { ...buildClerkProps(req), categories } };
};
