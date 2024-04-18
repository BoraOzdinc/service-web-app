
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { PERMS } from "~/_constants/perms";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { nonEmptyString } from "./items";
import { $Enums } from "@prisma/client";

const addCustomerSchema = z.object({
  name: nonEmptyString,
  surname: nonEmptyString,
  phoneNumber: nonEmptyString,
  email: nonEmptyString,
  identificationNo: z.string().optional(),

  companyName: z.string().optional(),
  taxDep: z.string().optional(),
  taxNumber: z.string().optional(),

  adresses: z.array(z.object({
    Type: z.nativeEnum($Enums.AdressType).optional(),
    PhoneNumber: z.string().optional(),
    Country: z.string().optional(),
    Province: z.string().optional(),
    District: z.string().optional(),
    Neighbour: z.string().optional(),
    ZipCode: z.string().optional(),
    Adress: z.string().optional(),
  })).optional(),

  connectedDealerId: z.string().optional(),
  priceType: nonEmptyString
})
const updateCustomerSchema = z.object({
  customerId: nonEmptyString,
  name: nonEmptyString,
  surname: nonEmptyString,
  phoneNumber: nonEmptyString,
  email: nonEmptyString,
  identificationNo: z.string().optional(),

  companyName: z.string().optional(),
  taxDep: z.string().optional(),
  taxNumber: z.string().optional(),

  connectedDealerId: z.string().optional(),
  priceType: nonEmptyString
})
const addOrUpdateAddressSchema = z.object({
  addressId: z.string().optional(),
  customerId: nonEmptyString,
  Type: z.nativeEnum($Enums.AdressType),
  PhoneNumber: z.string().optional(),
  Country: z.string().optional(),
  Province: z.string().optional(),
  District: z.string().optional(),
  Neighbour: z.string().optional(),
  ZipCode: z.string().optional(),
  Adress: nonEmptyString,
})

export const customerRouter = createTRPCRouter({
  getCustomers: protectedProcedure.query(async ({ ctx }) => {

    const userPerms = ctx.session.user.permissions
    if (!userPerms.includes(PERMS.customers_view)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have permission to do this!"
      })
    }
    return await ctx.db.customer.findMany({
      where: {
        OR: [
          { orgId: ctx.session.user.orgId },
          { dealerId: ctx.session.user.dealerId }
        ]
      },
      include: { connectedDealer: true }
    })
  }),
  getCustomerWithId: protectedProcedure.input(nonEmptyString).query(async ({ input, ctx }) => {
    const userPerms = ctx.session.user.permissions
    if (!userPerms.includes(PERMS.customers_view)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have permission to do this!"
      })
    }
    return await ctx.db.customer.findFirst({
      where: {
        id: input,
        OR: [
          { orgId: ctx.session.user.orgId },
          { dealerId: ctx.session.user.dealerId }
        ]
      },
      include: { adresses: true, connectedDealer: true }
    })
  }),
  addCustomer: protectedProcedure.input(addCustomerSchema).mutation(async ({ ctx, input }) => {
    const userPerms = ctx.session.user.permissions

    if (!userPerms.includes(PERMS.manage_customers)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have permission to do this!"
      })
    }

    const priceEnum = z.nativeEnum($Enums.PriceType);
    const priceType = priceEnum.parse(input.priceType);
    if (input.adresses && !input.adresses.every(a => a?.Type === undefined)) {

      return await ctx.db.customer.create({
        data: { ...input, adresses: { createMany: { data: input.adresses.map(a => ({ ...a, Type: a.Type ?? $Enums.AdressType.Normal })) } }, priceType, dealerId: ctx.session.user.dealerId, orgId: ctx.session.user.orgId }
      })
    }

    return await ctx.db.customer.create({
      data: { ...input, adresses: undefined, priceType, dealerId: ctx.session.user.dealerId, orgId: ctx.session.user.orgId }
    })
  }),
  updateCustomer: protectedProcedure.input(updateCustomerSchema).mutation(async ({ ctx, input }) => {
    const userPerms = ctx.session.user.permissions

    if (!userPerms.includes(PERMS.manage_customers)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have permission to do this!"
      })
    }

    const priceEnum = z.nativeEnum($Enums.PriceType);
    const priceTypeEnum = priceEnum.parse(input.priceType);

    const moddedInput = (({ customerId: _customerId, ...o }) => o)(input)

    return await ctx.db.customer.update({
      where: { id: input.customerId, },
      data: { ...moddedInput, priceType: priceTypeEnum }
    })
  }),
  addAddress: protectedProcedure.input(addOrUpdateAddressSchema).mutation(async ({ ctx, input }) => {
    const userPerms = ctx.session.user.permissions

    if (!userPerms.includes(PERMS.manage_customers)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have permission to do this!"
      })
    }
    const moddedInput = (({ addressId: _addressId, ...o }) => o)(input)

    return await ctx.db.adress.create({ data: { ...moddedInput } })
  }),
  updateAddress: protectedProcedure.input(addOrUpdateAddressSchema).mutation(async ({ ctx, input }) => {
    const userPerms = ctx.session.user.permissions

    if (!userPerms.includes(PERMS.manage_customers)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have permission to do this!"
      })
    }
    const moddedInput = (({ addressId: _addressId, customerId: _customerId, ...o }) => o)(input)

    return await ctx.db.adress.update({ where: { id: input.addressId }, data: { ...moddedInput } })
  }),
  deleteAddress: protectedProcedure.input(nonEmptyString).mutation(async ({ ctx, input }) => {
    const userPerms = ctx.session.user.permissions

    if (!userPerms.includes(PERMS.manage_customers)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have permission to do this!"
      })
    }

    return await ctx.db.adress.delete({ where: { id: input } })
  }),
  getCustomerTransactions: protectedProcedure.input(nonEmptyString).query(async ({ ctx, input }) => {
    const userPerms = ctx.session.user.permissions

    if (!userPerms.includes(PERMS.customers_view)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have permission to do this!",
      });
    }

    return await ctx.db.transaction.findMany({
      where: { customerId: input },
      include: {
        boughtItems: { include: { item: { include: { itemBarcode: true } } } },
        ItemSellHistory: true,
        storage: { select: { name: true } }
      },
      orderBy: { createDate: "desc" }
    })
  })
});
