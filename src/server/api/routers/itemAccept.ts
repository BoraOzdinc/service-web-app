import { PERMS } from "~/_constants/perms";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { nonEmptyString } from "./items";


export const ItemAcceptRouter = createTRPCRouter({
    getStorageNCustomer: protectedProcedure.query(async ({ ctx }) => {
        const userPerms = ctx.session.permissions
        if (!userPerms.includes(PERMS.item_accept)) {
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
        const { data: customers, error: customersError } = await ctx.supabase.from("Customer").select("id,name,companyName,surname,connectedDealerId").eq("orgId", ctx.session.orgId)
        if (customersError) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to get customers",
            });
        }
        return { storages, customers }
    }),
    itemAccept: protectedProcedure
        .input(
            z.object({
                storageId: nonEmptyString,
                fromCustomerId: nonEmptyString,
                items: z.object({
                    itemId: nonEmptyString,
                    barcode: nonEmptyString,
                    quantity: z.number().min(1),
                }).array().min(1)
            }))
        .mutation(async ({ ctx, input }) => {
            if (!input) {
                new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid Payload!"
                })
            }
            const userPerms = ctx.session.permissions

            if (!userPerms.includes(PERMS.item_accept)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            const { error: storageError } = await ctx.supabase.from("Storage").select("*,ItemStock(Item(*))").eq("id", input.storageId).single()
            if (storageError) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Storage not found!" + storageError.message,
                });
            }

            input.items.map(async (i) => {
                const { data: existingItemStock, error: itemStockError } = await ctx.supabase.from("ItemStock").select("*,Item(*)").eq("itemId", i.itemId).eq("storageId", input.storageId)
                if (itemStockError) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "existing item stock not found!" + itemStockError.message,
                    });
                }
                const { data: barcodeDetails, error: barcodeError } = await ctx.supabase.from("itemBarcode").select("*,Item(*)").eq("barcode", i.barcode).eq("itemId", i.itemId).single()
                if (barcodeError) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Barkod Bulunamadı!",
                    });
                }
                if (existingItemStock && existingItemStock.length > 0) {
                    const { error } = await ctx.supabase.from("ItemStock").update({ stock: (i.quantity * barcodeDetails.quantity) + (existingItemStock?.[0]?.stock ?? 0) }).eq("id", existingItemStock?.[0]?.id ?? "")
                    if (error) {
                        throw new TRPCError({
                            code: "BAD_REQUEST",
                            message: error.message,
                        });
                    }
                } else {
                    const { error } = await ctx.supabase.from("ItemStock").insert({ id: createId(), itemId: i.itemId, stock: i.quantity * barcodeDetails.quantity, storageId: input.storageId })
                    if (error) {
                        throw new TRPCError({
                            code: "BAD_REQUEST",
                            message: error.message,
                        });
                    }
                }
                const { data: history, error } = await ctx.supabase.from("ItemAcceptHistory")
                    .insert({
                        id: createId(),
                        customerId: input.fromCustomerId,
                        storageId: input.storageId,
                        name: ctx.session.email ?? "Bilinmeyen Kullanıcı",
                        orgId: ctx.session.orgId,
                        createDate: new Date().toUTCString()
                    }).select().single()
                if (error) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Internal Server Error",
                    });
                }
                await ctx.supabase.from("ItemAcceptDetail")
                    .insert({
                        id: createId(),
                        itemId: i.itemId,
                        itemAcceptHistoryId: history.id,
                        itemBarcodeId: barcodeDetails.id,
                        quantity: i.quantity,
                    })
            })
            return "success"
        }),
})