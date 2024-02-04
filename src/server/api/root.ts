import { customerRouter } from "~/server/api/routers/customer";
import { createTRPCRouter } from "~/server/api/trpc";
import { itemsRouter } from "./routers/items";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  customer: customerRouter,
  items: itemsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
