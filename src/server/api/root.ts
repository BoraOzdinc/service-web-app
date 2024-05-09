import { customerRouter } from "~/server/api/routers/customer";
import { createTRPCRouter } from "~/server/api/trpc";
import { itemsRouter } from "./routers/items";
import { organizationRouter } from "./routers/organization";
import { dealerRouter } from "./routers/dealer";
import { UtilsRouter } from "./routers/utils";
import { StorageRouter } from "./routers/storage";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  customer: customerRouter,
  items: itemsRouter,
  orgs: organizationRouter,
  organization: organizationRouter,
  dealer: dealerRouter,
  utilRouter: UtilsRouter,
  storage: StorageRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
