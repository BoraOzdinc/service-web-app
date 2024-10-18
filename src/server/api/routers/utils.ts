import { createTRPCRouter, protectedProcedure } from "../trpc";

export const UtilsRouter = createTRPCRouter({
    getEuroPrice: protectedProcedure.query(async () => {
        return 34

    }),

})