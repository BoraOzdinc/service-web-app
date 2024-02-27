import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const organizationRouter = createTRPCRouter({
    createOrg: publicProcedure.input(z.string().min(1))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.org.create({ data: { orgName: input, Users: { connect: { id: ctx.session?.user.id } } } })
        })
});