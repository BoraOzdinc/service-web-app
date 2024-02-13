import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";


const addCustomerSchema = z.object({
  customerName: z.string().min(1),
  phoneNumber: z.string().min(1)

})
export const customerRouter = createTRPCRouter({
  addCustomer: protectedProcedure.input(addCustomerSchema)
    .mutation(async ({ ctx }) => {
      const org = await ctx.db.org.findMany({ include: { Users: true } })
      return { org }
    })

});
