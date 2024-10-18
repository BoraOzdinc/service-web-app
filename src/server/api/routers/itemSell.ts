import { createId } from "@paralleldrive/cuid2";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { PERMS } from "~/_constants/perms";
import { z } from "zod";
import { nonEmptyString } from "./items";
import { $Enums } from "@prisma/client";

const itemSellSchema = z.object({
    storageId: nonEmptyString,
    customerId: nonEmptyString,
    discount: z.number(),
    totalPayAmount: z.number(),
    priceToPay: z.number(),
    selectedPriceType: z.nativeEnum($Enums.PriceType).optional(),
    exchangeRate: z.number().optional(),
    transferToDealer: z.boolean(),
    paidAmount: z.number(),
    saleCancel: z.boolean(),
    items: z.array(z.object({
        itemId: z.string(),
        price: z.number().optional(),
        barcode: nonEmptyString,
        totalAdded: z.number(),
        serialNumbers: z.string().array()
    }))
})

export const ItemSellRouter = createTRPCRouter({
    getStorageNCustomer: protectedProcedure.query(async ({ ctx }) => {
        const userPerms = ctx.session.permissions
        if (!userPerms.includes(PERMS.item_sell)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        if (!ctx.session.orgId) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        const { data: storages, error: storagesError } = await ctx.supabase.from("Storage").select("id,name").eq("orgId", ctx.session.orgId)
        if (storagesError) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to get storages",
            });
        }
        const { data: customers, error: customersError } = await ctx.supabase.from("Customer").select("*").eq("orgId", ctx.session.orgId)
        if (customersError) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to get customers",
            });
        }
        const { data: org } = await ctx.supabase.from("Org").select("*,dealerRelations:DealerRelation!DealerRelation_parentOrgId_fkey(*,dealer:Org!DealerRelation_dealerId_fkey(*))").eq("id", ctx.session.orgId).single()
        const dealers = org?.dealerRelations.flatMap(d => d.dealer)
        const customersData = customers.map(c => ({ ...c, dealerPriceType: dealers?.find(d => d?.id === c.connectedDealerId)?.priceType ?? $Enums.PriceType.org }))
        return { storages, customers: customersData }
    }),
    itemSell: protectedProcedure.input(itemSellSchema).mutation(async ({ input, ctx }) => {
        const userPerms = ctx.session.permissions

        if (!userPerms.includes(PERMS.item_sell)) {

        }
        const { data: customer, error } = await ctx.supabase.from("Customer").select("*").eq("id", input.customerId).single()
        if (error) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to get customer",
            });
        }
        const { data: storage, error: storageError } = await ctx.supabase.from("Storage").select("*").eq("id", input.storageId).single()
        if (storageError) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to get storage",
            });
        }

        const priceEnum = z.nativeEnum($Enums.PriceType);
        const priceType = priceEnum.parse(input.selectedPriceType);

        if (!input.saleCancel) {
            input.items.map(async (i) => {
                const itemStock = await ctx.supabase.from("ItemStock").select("*").eq("itemId", i.itemId).eq("storageId", storage.id).single()
                if (itemStock.error) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }

                const remainingStock = itemStock.data.stock - i.totalAdded
                if (remainingStock < 0) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Deponuzdaki Ürünler Yeterli Değil",
                    });
                }
                const { error } = await ctx.supabase.from("ItemStock").update({ stock: remainingStock }).eq("id", itemStock.data?.id)

                if (error) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Failed to update stock " + error.message,
                    });
                }
            })
        }
        const member = await ctx.supabase.from("Member").select("*").eq("userEmail", ctx.session.email ?? "").maybeSingle()
        const transaction = await ctx.supabase.from("Transaction").insert({
            id: createId(),
            updatedAt: new Date().toUTCString(),
            memberId: member.data?.id,
            orgId: ctx.session.orgId,
            transferredDealerId: input.transferToDealer ? customer.connectedDealerId : null,
            customerId: customer.id,
            discount: String(input.discount),
            exchangeRate: String(input.exchangeRate),
            priceType: priceType,
            storageId: input.storageId,
            totalAmount: String(input.totalPayAmount),
            transactionType: input.saleCancel ? "Cancel" : "Sale",
            payAmount: String(input.paidAmount),
        }).select().single()

        if (transaction.error) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to create transaction",
            })
        }
        const createdTransactionItemDetails = await Promise.all(input.items.map(async (i) => {
            const item = await ctx.supabase.from("Item").select("*").eq("id", i.itemId).single()
            if (item.error) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Failed to get item",
                })
            }
            if (item.error) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Failed to get item",
                })
            }
            const customerPriceType = customer.priceType

            const customerPrice = customerPriceType === "org" ? item.data.singlePrice : item.data[customerPriceType]
            if (customer.connectedDealerId) {
                const dealer = await ctx.supabase.from("Org").select("*").eq("id", customer.connectedDealerId).single()
                if (dealer.error) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Failed to get dealer price type",
                    })
                }
                const dealerPriceType = dealer.data.priceType
                const dealerPrice = dealerPriceType === "org" ? null : item.data[dealerPriceType]
                const { data: transactionItemDetail, error } = await ctx.supabase.from("TransactionItemDetail").insert({
                    id: createId(),
                    customerTransactionId: transaction.data.id,
                    itemId: i.itemId,
                    customerPrice: String(customerPrice),
                    dealerPrice: String(dealerPrice),
                    quantity: i.totalAdded,
                    serialNumbers: i.serialNumbers,
                }).select().single()
                if (error) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Failed to create transaction item detail",
                    })
                }
                return transactionItemDetail
            }
            const { data: transactionItemDetail, error } = await ctx.supabase.from("TransactionItemDetail").insert({
                id: createId(),
                customerTransactionId: transaction.data.id,
                itemId: i.itemId,
                customerPrice: String(customerPrice),
                quantity: i.totalAdded,
                serialNumbers: i.serialNumbers,
            })
            if (error) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Failed to create transaction item detail",
                })
            }
            return transactionItemDetail
        }))

        return createdTransactionItemDetails
    }),
})