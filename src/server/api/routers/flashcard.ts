import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getUser, getUserList } from "../helpers/userCache";

export const flashcardRouter = createTRPCRouter({
  history: protectedProcedure.query(async ({ ctx }) => {
    const history = await ctx.prisma.history.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 4,
      select: {
        set: {
          select: {
            id: true,
            name: true,
            ownerId: true,
            thumbnail: true,
            _count: {
              select: {
                flashCards: true,
              },
            },
          },
        },
      },
    });
    const ownersIds = history.map((h) => h.set.ownerId);
    const owners = await getUserList(ownersIds);

    return history.map((h) => {
      const user = owners.find((o) => o.id === h.set.ownerId);
      return {
        ...h,
        set: {
          ...h.set,
          owner: {
            username: user?.username,
            firstName: user?.firstName,
            lastName: user?.lastName,
            profileImageUrl: user?.profileImageUrl,
          },
        },
      };
    });
  }),
  popular: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(4),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const sets = await ctx.prisma.flashCardSet.findMany({
        where: {
          privacy: "PUBLIC",
          history: {
            every: {
              createdAt: {
                gte: today,
              },
            },
          },
        },
        orderBy: {
          history: {
            _count: "desc",
          },
        },
        take: input.limit,
        select: {
          id: true,
          name: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          ownerId: true,
          thumbnail: true,
          _count: {
            select: {
              flashCards: true,
            },
          },
        },
      });
      const ownersIds = sets.map((s) => s.ownerId);
      const owners = await getUserList(ownersIds);

      return sets.map((s) => {
        const user = owners.find((o) => o.id === s.ownerId);
        return {
          ...s,
          owner: {
            username: user?.username,
            firstName: user?.firstName,
            lastName: user?.lastName,
            profileImageUrl: user?.profileImageUrl,
          },
        };
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        thumbnail: z.string().url(),
        privacy: z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]),
        categoryId: z.string(),
        flashcards: z.array(
          z.object({
            word: z.string(),
            translation: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { categoryId, description, flashcards, name, privacy, thumbnail } =
        input;

      return await ctx.prisma.flashCardSet.create({
        data: {
          name,
          description,
          thumbnail,
          privacy,
          categoryId,
          ownerId: ctx.auth.userId,
          flashCards: {
            createMany: {
              data: flashcards,
            },
          },
        },
        select: {
          id: true,
        },
      });
    }),
  get: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const set = await ctx.prisma.flashCardSet.findUnique({
      where: {
        id: input,
      },
      select: {
        id: true,
        name: true,
        description: true,
        thumbnail: true,
        privacy: true,
        ownerId: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        flashCards: {
          select: {
            id: true,
            word: true,
            translation: true,
          },
        },
      },
    });

    if (!set) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Flashcard set not found",
      });
    }

    return {
      ...set,
      owner: (await getUser(set.ownerId))!,
    };
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        thumbnail: z.string().url().optional(),
        privacy: z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]).optional(),
        categoryId: z.string().optional(),
        flashcards: z
          .array(
            z.union([
              z.object({
                word: z.string(),
                translation: z.string(),
              }),
              z.object({
                id: z.string(),
                word: z.string().optional(),
                translation: z.string().optional(),
              }),
            ])
          )
          .optional()
          .default([]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        id,
        categoryId,
        description,
        flashcards,
        name,
        privacy,
        thumbnail,
      } = input;

      const set = await ctx.prisma.flashCardSet.findUnique({
        where: {
          id,
        },
        select: {
          ownerId: true,
        },
      });

      if (!set) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (set.ownerId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      // update flashcards if there is an id, update it
      // otherwise create a new one
      await ctx.prisma.$transaction([
        ctx.prisma.flashCardSet.update({
          where: {
            id,
          },
          data: {
            name,
            description,
            thumbnail,
            privacy,
            categoryId,
          },
        }),
        ...flashcards.map((flashcard) =>
          ctx.prisma.flashCard.upsert({
            where: {
              // @ts-expect-error id is optional
              id: flashcard?.id as string | undefined,
            },
            create: {
              word: flashcard.word!,
              translation: flashcard.translation!,
              set: {
                connect: {
                  id,
                },
              },
            },
            update: {
              word: flashcard.word,
              translation: flashcard.translation,
            },
          })
        ),
      ]);

      return true;
    }),
  remove: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const set = await ctx.prisma.flashCardSet.findUnique({
        where: {
          id: input,
        },
        select: {
          ownerId: true,
        },
      });

      if (!set) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (set.ownerId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      await ctx.prisma.flashCardSet.delete({
        where: {
          id: input,
        },
      });
      return true;
    }),
  categories: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
        take: input.limit,
        orderBy: {
          sets: {
            _count: "desc",
          },
        },
      });
    }),
  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        page: z.number().optional().default(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, page } = input;

      const sets = await ctx.prisma.flashCardSet.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
          // if user is logged in show sets that are public or owned by user
          // otherwise show only public sets
          ...(ctx.auth.userId
            ? {
                OR: [
                  {
                    privacy: "PUBLIC",
                  },
                  {
                    ownerId: ctx.auth.userId,
                  },
                ],
              }
            : {
                privacy: "PUBLIC",
              }),
        },
        skip: (page - 1) * 10,
        take: 10,
        select: {
          id: true,
          name: true,
          description: true,
          thumbnail: true,
          privacy: true,
          ownerId: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          flashCards: {
            select: {
              id: true,
              word: true,
              translation: true,
            },
          },
        },
      });

      const ownersIds = sets.map((s) => s.ownerId);
      const owners = await getUserList(ownersIds);

      return sets.map((s) => {
        const user = owners.find((o) => o.id === s.ownerId);
        return {
          ...s,
          owner: {
            username: user?.username,
            firstName: user?.firstName,
            lastName: user?.lastName,
            profileImageUrl: user?.profileImageUrl,
          },
        };
      });
    }),
});
