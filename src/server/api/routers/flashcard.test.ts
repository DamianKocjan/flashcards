/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * Integration test example for the `flashcard` router
 */

import { expect, test } from "vitest";
import { appRouter } from "../root";
import { createInnerTRPCContext } from "../trpc";

test("get history", async () => {
  const ctx = createInnerTRPCContext({
    // @ts-expect-error
    auth: {
      userId: "test",
    },
  });
  const caller = appRouter.createCaller(ctx);

  const history = await caller.flashcard.history();
  expect(history).toEqual([]);
});
