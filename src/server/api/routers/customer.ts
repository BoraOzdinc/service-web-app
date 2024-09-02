
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { PERMS } from "~/_constants/perms";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { nonEmptyString } from "./items";
import { $Enums } from "@prisma/client";
import { isAuthorised } from "~/utils";
import { createId } from "@paralleldrive/cuid2";

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
  getCustomers: protectedProcedure.input(z.object({ orgId: z.string().optional() })).query(async ({ ctx, input }) => {
    if (!ctx.session.permissions.includes(PERMS.customers_view)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have permission to do this!"
      })
    }
    if (!ctx.session.orgId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have permission to do this!"
      })
    }
    const filterOrgId = input.orgId ? input.orgId : ctx.session.orgId
    const { data: customers, error } = await ctx.supabase.from("Customer").select("*").eq("orgId", filterOrgId)
    if (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to get customers:" + error.message,
      })
    }
    if (ctx.session.orgId !== filterOrgId) {
      const isUserAuthorised = await isAuthorised(ctx.supabase, ctx.session.orgId ?? "", input.orgId ?? "")
      if (!isUserAuthorised) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have permission to do this!",
        });
      }
    }
    const { data: org } = await ctx.supabase.from("Org").select("*,dealerRelations:DealerRelation!DealerRelation_parentOrgId_fkey(*,dealer:Org!DealerRelation_dealerId_fkey(*))").eq("id", ctx.session.orgId).single()
    const dealers = org?.dealerRelations.flatMap(d => d.dealer)
    return customers.map(c => ({ ...c, dealerPriceType: dealers?.find(d => d?.id === c.connectedDealerId)?.priceType ?? $Enums.PriceType.org }))
  }),
  getCustomerWithId: protectedProcedure.input(nonEmptyString).query(async ({ input, ctx }) => {
    const userPerms = ctx.session.permissions
    if (!userPerms.includes(PERMS.customers_view)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have permission to do this!"
      })
    }
    const { data: customer, error } = await ctx.supabase.from("Customer").select("*,Address(*)").eq("id", input).maybeSingle()
    if (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to get customer:" + error.message,
      })
    }

    if (ctx.session.orgId !== customer?.orgId) {
      const isUserAuthorised = await isAuthorised(ctx.supabase, ctx.session.orgId ?? "", customer?.orgId ?? "")
      if (!isUserAuthorised) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have permission to do this!",
        });
      }
    }
    return customer

  }),
  addCustomer: protectedProcedure.input(addCustomerSchema).mutation(async ({ ctx, input }) => {
    const userPerms = ctx.session.permissions

    if (!userPerms.includes(PERMS.manage_customers)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have permission to do this!"
      })
    }

    const priceEnum = z.nativeEnum($Enums.PriceType);
    const priceType = priceEnum.parse(input.priceType);
    if (input.adresses && !input.adresses.every(a => a?.Type === undefined)) {
      const { data: customer, error } = await ctx.supabase.from("Customer")
        .insert({
          id: createId(),
          name: input.name,
          surname: input.surname,
          phoneNumber: input.phoneNumber,
          email: input.email,
          identificationNo: input.identificationNo,
          companyName: input.companyName,
          taxDep: input.taxDep,
          taxNumber: input.taxNumber,
          priceType: priceType,
          orgId: ctx.session.orgId,
          connectedDealerId: input.connectedDealerId
        }).select().single()
      if (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create customer:" + error.message,
        })
      }
      const { error: customerAddressesError } = await ctx.supabase.from("Address")
        .insert(
          input.adresses.map(a => ({
            id: createId(),
            Type: a.Type ?? $Enums.AdressType.Normal,
            PhoneNumber: a.PhoneNumber,
            Country: a.Country,
            Province: a.Province,
            District: a.District,
            Neighbour: a.Neighbour,
            ZipCode: a.ZipCode,
            Adress: a.Adress,
            customerId: customer.id,

          }))
        )
      if (customerAddressesError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create customer addresses:" + customerAddressesError.message,
        })
      }
      return customer
    }

    const { data: customer, error } = await ctx.supabase.from("Customer")
      .insert({
        id: createId(),
        name: input.name,
        surname: input.surname,
        phoneNumber: input.phoneNumber,
        email: input.email,
        identificationNo: input.identificationNo,
        companyName: input.companyName,
        taxDep: input.taxDep,
        taxNumber: input.taxNumber,
        priceType: priceType,
        orgId: ctx.session.orgId,
        connectedDealerId: input.connectedDealerId
      }).select().single()
    if (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to create customer:" + error.message,
      })
    }
    return customer

  }),
  updateCustomer: protectedProcedure.input(updateCustomerSchema).mutation(async ({ ctx, input }) => {
    const userPerms = ctx.session.permissions

    if (!userPerms.includes(PERMS.manage_customers)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have permission to do this!"
      })
    }

    const priceEnum = z.nativeEnum($Enums.PriceType);
    const priceTypeEnum = priceEnum.parse(input.priceType);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const moddedInput = (({ customerId: _customerId, priceType, ...o }) => ({
      priceType: priceTypeEnum,
      ...o
    }))(input)
    const { data: customer, error } = await ctx.supabase.from("Customer").update(moddedInput)
      .eq("id", input.customerId).select().single()
    if (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to update customer:" + error.message,
      })
    }
    return customer
  }),
  addAddress: protectedProcedure.input(addOrUpdateAddressSchema).mutation(async ({ ctx, input }) => {
    const userPerms = ctx.session.permissions

    if (!userPerms.includes(PERMS.manage_customers)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have permission to do this!"
      })
    }
    const moddedInput = (({ addressId: _addressId, ...o }) => o)(input)

    const { data: address, error } = await ctx.supabase.from("Address")
      .insert({
        id: createId(),
        Type: moddedInput.Type,
        PhoneNumber: moddedInput.PhoneNumber,
        Country: moddedInput.Country,
        Province: moddedInput.Province,
        District: moddedInput.District,
        Neighbour: moddedInput.Neighbour,
        ZipCode: moddedInput.ZipCode,
        Adress: moddedInput.Adress,
        customerId: moddedInput.customerId,
      }).select().single()
    if (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to create customer address:" + error.message,
      })
    }
    return address
  }),
  updateAddress: protectedProcedure.input(addOrUpdateAddressSchema).mutation(async ({ ctx, input }) => {
    const userPerms = ctx.session.permissions

    if (!userPerms.includes(PERMS.manage_customers)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have permission to do this!"
      })
    }
    if (!input.addressId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid Payload!"
      })
    }
    const moddedInput = (({ addressId: _addressId, customerId: _customerId, ...o }) => o)(input)
    const { data: address, error } = await ctx.supabase.from("Address")
      .update({
        Type: moddedInput.Type,
        PhoneNumber: moddedInput.PhoneNumber,
        Country: moddedInput.Country,
        Province: moddedInput.Province,
        District: moddedInput.District,
        Neighbour: moddedInput.Neighbour,
        ZipCode: moddedInput.ZipCode,
        Adress: moddedInput.Adress,
      }).eq("id", input.addressId).select().single()
    if (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to create customer address:" + error.message,
      })
    }
    return address
  }),
  deleteAddress: protectedProcedure.input(nonEmptyString).mutation(async ({ ctx, input }) => {
    const userPerms = ctx.session.permissions

    if (!userPerms.includes(PERMS.manage_customers)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have permission to do this!"
      })
    }
    const { error } = await ctx.supabase.from("Address").delete().eq("id", input)
    if (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to delete customer address:" + error.message,
      })
    }
    return "success"
  }),
  getCustomerTransactions: protectedProcedure.input(nonEmptyString).query(async ({ ctx, input }) => {
    const userPerms = ctx.session.permissions

    if (!userPerms.includes(PERMS.customers_view)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have permission to do this!",
      });
    }

    return await ctx.db.transaction.findMany({
      where: { customerId: input },
      include: {
        items: { include: { CustomerTransaction: true, item: { include: { itemBarcode: true } } } },
        storage: { select: { name: true } }
      },
      orderBy: { createDate: "desc" }
    })
  }),
  payUpDebt: protectedProcedure
    .input(z.object({ transactionId: nonEmptyString, paidAmount: z.number().min(0) }))
    .mutation(async ({ ctx, input: { paidAmount, transactionId } }) => {
      const userPerms = ctx.session.permissions
      if (!userPerms.includes(PERMS.manage_customers)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have permission to do this!"
        })
      }
      const { data: transaction, error } = await ctx.supabase.from("Transaction").select("*").eq("id", transactionId).single()
      if (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to get transaction:" + error.message,
        })
      }
      const discountedAmount =
        Number(transaction.totalAmount) -
        (Number(transaction.totalAmount) * Number(transaction.discount)) / 100 -
        Number(transaction.payAmount);
      console.log(((Number(transaction.totalAmount) ?? 0) < (Number(discountedAmount.toFixed(2)) + paidAmount)));

      if (paidAmount > Number(discountedAmount.toFixed(2)) || ((Number(transaction.totalAmount) ?? 0) < (Number(discountedAmount.toFixed(2)) + paidAmount))) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Pay Amount is greater than discounted amount or total amount is less than discounted amount + pay amount"
        })
      }
      const { data: updatedTransaction, error: updateError } = await ctx.supabase.from("Transaction").update({
        payAmount: (paidAmount + Number(transaction.payAmount)).toFixed(2)
      }).eq("id", transactionId).select().single()
      if (updateError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to update transaction:" + updateError.message,
        })
      }
      return updatedTransaction
    })
});

