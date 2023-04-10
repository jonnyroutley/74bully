import { createTRPCRouter } from "@/server/api/trpc";
import { shoppingRouter } from "@/server/api/routers/shopping";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  shopping: shoppingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
