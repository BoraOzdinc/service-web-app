/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { z, ZodError } from "zod";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { env } from "process";
import { type Session } from "next-auth";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const session = await getServerAuthSession();

  return {
    db,
    session,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;


const UserIdWithToken = z.object({
  "auth": z.string().min(1),
  authorization: z.literal(env.DISCORD_TOKEN),
});

const enforceIsInternal = t.middleware(async ({ ctx, next }) => {
  const parsed = UserIdWithToken.safeParse(ctx.req.headers);
  if (!parsed.success)
    return next({ ctx: { ...ctx, internalAuthId: null } });

  const authId = parsed.data.auth;

  const user = await db.user.findFirst({
    where: { accounts: { some: { providerAccountId: authId } } },
  });

  const context = user
    ? {
      ...ctx,
      session: {
        user: { ...user, authId, inOrg: true },
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      } satisfies Session,
    }
    : { ...ctx, session: null, internalAuthId: authId };

  return next({ ctx: context });
});


export const internalProcedure = t.procedure.use(enforceIsInternal);



const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (
    !ctx.session ||
    !ctx.session.user ||
    !ctx.session.user.inOrg
  ) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Henüz Bir Organizasyonda değilsin. Yöneticin ile iletişime geç!",
    });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
export const protectedProcedure = internalProcedure.use(enforceUserIsAuthed)