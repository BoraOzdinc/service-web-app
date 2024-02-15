import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const addItemSchema = z.object({
    productName: z.string().min(1),
    barcode: z.string().min(1),
    serialNo: z.string().min(1),
    brand: z.string().min(1),
    storage: z.string().min(1),
    stock: z.number(),
    mainDealerPrice: z.string().min(1),
    multiPrice: z.string().min(1),
    dealerPrice: z.string().min(1),
    singlePrice: z.string().min(1),
})

export const itemsRouter = createTRPCRouter({

    getItems: publicProcedure.query(async ({ ctx }) => {

        const userId = ctx.session?.user.id
        console.log("USER ID: ", userId);

        const org = await ctx.db.org.findFirst({ where: { Users: { some: { id: userId } } } })

        if (!org) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Organizasyon Bulunamadı" })
        }

        const orgItems = await ctx.db.item.findMany({ where: { orgId: org.id }, include: { ItemStock: { select: { stock: true } } } });

        const formattedItems = orgItems.map((item) => {
            const totalStock = item.ItemStock.reduce((sum, s) => sum + s.stock, 0);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { ItemStock, ...formattedItem } = item;
            return { ...formattedItem, totalStock: totalStock };
        });

        return formattedItems
    }),
    getItemWithId: publicProcedure.input(z.string().min(1)).query(async ({ ctx, input }) => {
        if (!input) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "no payload"
            })
        }
        const item = await ctx.db.item.findFirst({ where: { id: input }, include: { ItemHistory: { include: { fromStorage: true, toStorage: true, item: true, org: true, user: true } }, ItemStock: { include: { storage: true, item: true } }, Org: true, Service: true } })
        if (!item) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Ürün Bulunamadı"
            })
        }
        return item
    }),
    getStorages: publicProcedure.query(async ({ ctx }) => {
        const userId = ctx.session?.user.id
        const org = await ctx.db.org.findMany({ where: { Users: { some: { id: userId } } }, include: { storages: true } })
        const storages = org.map((o) => {
            return o.storages.map((s) => { return s })
        }).flat()
        return storages
    }),
    getOrganizations: publicProcedure.query(async ({ ctx }) => {
        const userId = ctx.session?.user.id
        const org = await ctx.db.org.findMany({ where: { Users: { some: { id: userId } } } })
        return org
    }),
    addStorage: publicProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
        const userId = ctx.session?.user.id
        const org = await ctx.db.org.findFirst({ where: { Users: { some: { id: userId } } } })
        if (!org) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Organizasyon Bulunamadı" })
        }
        return await ctx.db.storage.create({ data: { name: input, orgId: org.id } })
    }),
    deleteStorage: publicProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
        await ctx.db.itemStock.deleteMany({ where: { storageId: input } });
        await ctx.db.storage.delete({ where: { id: input }, });
    }),
    addItem: publicProcedure.input(addItemSchema).mutation(async ({ ctx, input }) => {
        const barcodedItem = await ctx.db.item.findFirst({ where: { barcode: input.barcode }, include: { ItemStock: true } })
        console.log("barcoded item: ", barcodedItem);
        const userId = ctx.session?.user.id
        if (!userId) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "user not found" })
        }
        const org = await ctx.db.org.findFirst({ where: { Users: { some: { id: userId } } } })
        if (!org) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Organizasyon Bulunamadı" })
        }
        const storage = await ctx.db.storage.findFirst({ where: { id: input.storage } })
        if (!storage) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Depo Bulunamadı!"
            })
        }

        let item;
        let itemStock;
        const itemInputData = { orgId: org?.id, storageId: input.storage, barcode: input.barcode, brand: input.brand, name: input.productName, serialNo: input.serialNo, dealerPrice: input.dealerPrice, mainDealerPrice: input.mainDealerPrice, multiPrice: input.multiPrice, singlePrice: input.singlePrice }

        if (barcodedItem) {
            item = barcodedItem
            const stock = item.ItemStock.find((s) => s.storageId === storage.id)
            if (stock) {
                itemStock = await ctx.db.itemStock.update({ where: { id: stock.id }, data: { stock: input.stock + stock.stock } })
            }
            else {
                itemStock = await ctx.db.itemStock.create({ data: { stock: input.stock, itemId: barcodedItem.id, storageId: storage.id } })
            }
        } else {
            item = await ctx.db.item.create({ data: itemInputData })
            itemStock = await ctx.db.itemStock.create({ data: { stock: input.stock, itemId: item.id, storageId: storage.id } })
        }

        if (!item) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error with Item" })
        }
        await ctx.db.itemHistory.create({ data: { description: "Eşya Ekleme", itemId: item.id, orgId: org.id, userId: userId, toStorageId: storage.id } })
        return [item, itemStock]
    }),
    updateItem: publicProcedure.input(z.object({
        itemId: z.string().min(1),
        productName: z.string().min(1),
        barcode: z.string().min(1),
        serialNo: z.string().min(1),
        brand: z.string().min(1),
        mainDealerPrice: z.string().min(1),
        multiPrice: z.string().min(1),
        dealerPrice: z.string().min(1),
        singlePrice: z.string().min(1),
    })).mutation(async ({ ctx, input }) => {
        const userId = ctx.session?.user.id;
        if (!userId) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "user not found" });
        }
        const org = await ctx.db.org.findFirst({ where: { Users: { some: { id: userId } } } });
        if (!org) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Organizasyon Bulunamadı" });
        }
        const item = await ctx.db.item.findFirst({ where: { id: input.itemId }, include: { ItemStock: true } });
        if (!item) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Ürün Bulunamadı"
            });
        }
        const updatedItem = await ctx.db.item.update({
            where: { id: input.itemId },
            data: {
                name: input.productName,
                barcode: input.barcode,
                serialNo: input.serialNo,
                brand: input.brand,
                mainDealerPrice: input.mainDealerPrice,
                multiPrice: input.multiPrice,
                dealerPrice: input.dealerPrice,
                singlePrice: input.singlePrice
            }
        });
        await ctx.db.itemHistory.create({ data: { description: "Eşya Güncelleme", itemId: item.id, orgId: org.id, userId: userId } });
        return updatedItem;
    }),
})