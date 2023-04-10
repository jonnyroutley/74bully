import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const shoppingRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.shoppingItems.findMany();
  }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.shoppingItems.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
})


