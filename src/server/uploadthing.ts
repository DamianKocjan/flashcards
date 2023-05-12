import { getAuth } from "@clerk/nextjs/server";
import { type NextApiRequest } from "next";
import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  thumbnailUploader: f
    .fileTypes(["image"])
    .maxSize("16MB")
    .middleware((req) => {
      const auth = getAuth(req as unknown as NextApiRequest);

      if (!auth.userId) throw new Error("Unauthorized");
      return { userId: auth.userId };
    })
    .onUploadComplete(({ metadata }) => {
      console.log("Upload complete for userId:", metadata.userId);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
export type Upload = {
  fileUrl: string;
};
