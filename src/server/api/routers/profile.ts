import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getUser } from "../helpers/userCache";

export const profileRouter = createTRPCRouter({
  popular: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        page: z.number().default(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, userId } = input;

      const LIMIT = 4;
      const OFFSET = (page - 1) * LIMIT;

      const privacy = ctx.auth.userId === userId ? undefined : "PUBLIC";

      const [sets, total] = await Promise.all([
        ctx.prisma.flashCardSet.findMany({
          where: {
            privacy,
            ownerId: userId,
          },
          orderBy: {
            history: {
              _count: "desc",
            },
          },
          take: LIMIT,
          skip: OFFSET,
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
        }),
        ctx.prisma.flashCardSet.count({
          where: {
            privacy,
            ownerId: userId,
          },
        }),
      ]);

      const owner = await getUser(userId);
      if (!owner) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }

      const lastPage = Math.ceil(total / LIMIT);
      const prev = page > 0 ? page - 1 : lastPage;
      const hasPrev = prev !== page;
      const next = page < lastPage ? page + 1 : undefined;
      const hasNext = !!next;

      return {
        results: sets.map((s) => {
          return {
            ...s,
            owner: {
              username: owner.username,
              firstName: owner.firstName,
              lastName: owner.lastName,
              profileImageUrl: owner.profileImageUrl,
            },
          };
        }),
        meta: {
          total,
          lastPage,
          page,
          prev,
          hasPrev,
          next,
          hasNext,
        },
      };
    }),
  flashcards: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        page: z.number().default(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, userId } = input;

      const LIMIT = 4;
      const OFFSET = (page - 1) * LIMIT;

      const [sets, total] = await Promise.all([
        ctx.prisma.flashCardSet.findMany({
          where: {
            ownerId: userId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: LIMIT,
          skip: OFFSET,
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
        }),
        ctx.prisma.flashCardSet.count({
          where: {
            ownerId: userId,
          },
        }),
      ]);

      const owner = await getUser(userId);
      if (!owner) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }

      const lastPage = Math.ceil(total / LIMIT);
      const prev = page > 0 ? page - 1 : lastPage;
      const hasPrev = prev !== page;
      const next = page < lastPage ? page + 1 : undefined;
      const hasNext = !!next;

      return {
        results: sets.map((s) => {
          return {
            ...s,
            owner: {
              username: owner.username,
              firstName: owner.firstName,
              lastName: owner.lastName,
              profileImageUrl: owner.profileImageUrl,
            },
          };
        }),
        meta: {
          total,
          lastPage,
          page,
          prev,
          hasPrev,
          next,
          hasNext,
        },
      };
    }),
  history: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        page: z.number().default(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, userId } = input;

      const LIMIT = 4;
      const OFFSET = (page - 1) * LIMIT;

      const [history, total] = await Promise.all([
        ctx.prisma.history.findMany({
          where: {
            userId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: LIMIT,
          skip: OFFSET,
          select: {
            set: {
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
            },
          },
        }),
        ctx.prisma.history.count({
          where: {
            userId,
          },
        }),
      ]);

      const owner = await getUser(userId);
      if (!owner) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }

      const lastPage = Math.ceil(total / LIMIT);
      const prev = page > 0 ? page - 1 : lastPage;
      const hasPrev = prev !== page;
      const next = page < lastPage ? page + 1 : undefined;
      const hasNext = !!next;

      return {
        results: history.map((h) => {
          return {
            ...h,
            set: {
              ...h.set,
              owner: {
                username: owner.username,
                firstName: owner.firstName,
                lastName: owner.lastName,
                profileImageUrl: owner.profileImageUrl,
              },
            },
          };
        }),
        meta: {
          total,
          lastPage,
          page,
          prev,
          hasPrev,
          next,
          hasNext,
        },
      };
    }),
});
