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

        const orgStorages = await ctx.db.org.findMany({ where: { Users: { some: { id: userId } } }, include: { storages: { include: { items: true } } } })


        const orgItems = orgStorages
            .map((o) => {
                return o.storages
                    .map((s) => {
                        return s.items;
                    })
                    .flat();
            })
            .flat();

        const itemMap = new Map<string, typeof orgItems[0]>();

        orgItems.forEach((item) => {
            const existingItem = itemMap.get(item.barcode);

            if (existingItem) {
                existingItem.stock += item.stock;
            } else {
                itemMap.set(item.barcode, { ...item });
            }
        });

        const uniqueItems = Array.from(itemMap.values());
        return uniqueItems
    }),
    getItemWithId: publicProcedure.input(z.string().min(1)).query(async ({ ctx, input }) => {
        if (!input) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "no payload"
            })
        }
        const item = await ctx.db.item.findFirst({ where: { id: input } })
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
    addItem: publicProcedure.input(addItemSchema).mutation(async ({ ctx, input }) => {
        const barcodedItems = await ctx.db.item.findMany({ where: { barcode: input.barcode } })
        console.log("barcoded items: ", barcodedItems);

        if (barcodedItems.length > 0) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Aynı barkoda sahip bir eşya bulundu!"
            })
        }
        const storage = await ctx.db.storage.findFirst({ where: { id: input.storage } })
        if (!storage) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Depo Bulunamadı!"
            })
        }
        return await ctx.db.item.create({ data: { storageId: input.storage, barcode: input.barcode, brand: input.brand, name: input.productName, serialNo: input.serialNo, dealerPrice: input.dealerPrice, mainDealerPrice: input.mainDealerPrice, multiPrice: input.multiPrice, singlePrice: input.singlePrice, stock: input.stock } })
    })
})