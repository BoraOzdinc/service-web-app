import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const addItemSchema = z.object({
    productName: z.string().min(1),
    barcode: z.string().min(1),
    itemCode: z.string().min(1),
    itemBrandId: z.string().min(1),
    storageId: z.string().min(1),
    itemColorId: z.string().min(1),
    itemSizeId: z.string().min(1),
    itemCategoryId: z.string().min(1),
    mainDealerPrice: z.string().min(1),
    multiPrice: z.string().min(1),
    dealerPrice: z.string().min(1),
    singlePrice: z.string().min(1),
    stock: z.number(),
    isSerialNoRequired: z.boolean(),
    isServiceItem: z.boolean(),
    netWeight: z.string().min(1),
    volume: z.string().min(1),
})

export const itemsRouter = createTRPCRouter({

    getItems: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {

        const userId = ctx.session?.user.id
        console.log("USER ID: ", userId);

        const org = await ctx.db.org.findFirst({ where: { Users: { some: { id: userId } } } })

        if (!org) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Organizasyon Bulunamadı" })
        }

        const orgItems = await ctx.db.item.findMany({ where: { orgId: org.id }, include: { ItemStock: { select: { stock: true } }, color: true, size: true, category: true, itemBarcode: true, brand: true } });

        const list = orgItems.filter((o) => (o.itemBarcode.find((b) => b.barcode.toLowerCase().includes(input.toLowerCase())) ?? o.itemCode.toLowerCase().includes(input.toLowerCase())) || o.name.toLowerCase().includes(input.toLowerCase())).map((o) => {
            const totalStock = o.ItemStock.reduce((sum, s) => sum + s.stock, 0) ?? 0;
            return { ...o, totalStock: totalStock };
        });

        return list
    }),
    getItemWithId: protectedProcedure.input(z.string().min(1)).query(async ({ ctx, input }) => {
        if (!input) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "no payload"
            })
        }
        const item = await ctx.db.item.findFirst({ where: { id: input }, include: { ItemHistory: { include: { fromStorage: true, toStorage: true, item: true, org: true, user: true } }, ItemStock: { include: { storage: true, item: true } }, Org: true, Service: true, brand: true, category: true, itemBarcode: true, color: true, size: true } })
        if (!item) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Ürün Bulunamadı"
            })
        }
        return item
    }),
    getStorages: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session?.user.id
        const org = await ctx.db.org.findMany({ where: { Users: { some: { id: userId } } }, include: { storages: true } })
        const storages = org.map((o) => {
            return o.storages.map((s) => { return s })
        }).flat()
        return storages
    }),
    getOrganizations: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session?.user.id
        const org = await ctx.db.org.findMany({ where: { Users: { some: { id: userId } } } })
        return org
    }),
    addStorage: protectedProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
        const userId = ctx.session?.user.id
        const org = await ctx.db.org.findFirst({ where: { Users: { some: { id: userId } } } })
        if (!org) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Organizasyon Bulunamadı" })
        }
        return await ctx.db.storage.create({ data: { name: input, orgId: org.id } })
    }),
    deleteStorage: protectedProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
        await ctx.db.itemStock.deleteMany({ where: { storageId: input } });
        await ctx.db.storage.delete({ where: { id: input }, });
    }),
    addItem: protectedProcedure.input(addItemSchema).mutation(async ({ ctx, input }) => {
        const sameBarcodedItem = await ctx.db.itemBarcode.findFirst({ where: { barcode: input.barcode } })
        if (sameBarcodedItem) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Aynı Barkoda Sahip Başka Bir Ürün Bulundu!" })
        }
        const userId = ctx.session?.user.id
        if (!userId) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Kullanıcı Bulunamadı!" })
        }
        const org = await ctx.db.org.findFirst({ where: { Users: { some: { id: userId } } } })
        if (!org) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Organizasyon Bulunamadı!" })
        }
        const storage = await ctx.db.storage.findFirst({ where: { id: input.storageId } })
        if (!storage) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Depo Bulunamadı!"
            })
        }

        const item = await ctx.db.item.create({
            data: {
                orgId: org.id,
                itemBrandId: input.itemBrandId,
                name: input.productName,
                itemCode: input.itemCode,
                dealerPrice: input.dealerPrice,
                mainDealerPrice: input.mainDealerPrice,
                multiPrice: input.multiPrice,
                singlePrice: input.singlePrice,
                isSerialNoRequired: input.isSerialNoRequired,
                isServiceItem: input.isServiceItem,
                itemColorId: input.itemColorId,
                itemSizeId: input.itemSizeId,
                netWeight: input.netWeight,
                volume: input.volume,
                itemCategoryId: input.itemCategoryId,
            }
        })
        const itemBarcode = await ctx.db.itemBarcode.create({ data: { isMaster: true, barcode: input.barcode, quantity: 1, unit: "Adet", itemId: item.id } })
        const itemStock = await ctx.db.itemStock.create({ data: { stock: input.stock, itemId: item.id, storageId: storage.id } })


        if (!item) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error with Item" })
        }
        await ctx.db.itemHistory.create({ data: { quantity: 1, description: "Eşya Ekleme", itemId: item.id, orgId: org.id, userId: userId, toStorageId: storage.id } })
        return [item, itemStock, itemBarcode]
    }),
    updateItem: protectedProcedure.input(z.object({
        itemId: z.string().min(1),
        productName: z.string().min(1),
        itemCode: z.string().min(1),
        itemBrandId: z.string().min(1),
        itemColorId: z.string().min(1),
        itemSizeId: z.string().min(1),
        itemCategoryId: z.string().min(1),
        mainDealerPrice: z.string().min(1),
        multiPrice: z.string().min(1),
        dealerPrice: z.string().min(1),
        singlePrice: z.string().min(1),
        netWeight: z.string().min(1),
        volume: z.string().min(1),
        isServiceItem: z.boolean(),
        isSerialNoRequired: z.boolean()
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
                itemCode: input.itemCode,
                itemBrandId: input.itemBrandId,
                itemColorId: input.itemColorId,
                itemCategoryId: input.itemCategoryId,
                itemSizeId: input.itemSizeId,
                netWeight: input.netWeight,
                volume: input.volume,
                isSerialNoRequired: input.isSerialNoRequired,
                isServiceItem: input.isServiceItem,
                mainDealerPrice: input.mainDealerPrice,
                multiPrice: input.multiPrice,
                dealerPrice: input.dealerPrice,
                singlePrice: input.singlePrice
            }
        });
        await ctx.db.itemHistory.create({ data: { quantity: 1, description: "Eşya Güncelleme", itemId: item.id, orgId: org.id, userId: userId } });
        return updatedItem;
    }),
    getColors: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session?.user.id;
        if (!userId) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "user not found" });
        }
        const org = await ctx.db.org.findFirst({ where: { Users: { some: { id: userId } } } });
        if (!org) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Organizasyon Bulunamadı" });
        }
        const colors = await ctx.db.itemColor.findMany({ where: { orgId: org.id } })
        return colors
    }),
    addColor: protectedProcedure.input(z.object({ colorCode: z.string().min(1), colorText: z.string().min(1) })).mutation(async ({ ctx, input }) => {
        const userId = ctx.session?.user.id;
        if (!userId) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "user not found" });
        }
        const org = await ctx.db.org.findFirst({ where: { Users: { some: { id: userId } } } });
        if (!org) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Organizasyon Bulunamadı" });
        }
        return await ctx.db.itemColor.create({ data: { colorCode: input.colorCode, colorText: input.colorText, orgId: org.id } })
    }),
    getSizes: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session?.user.id;
        if (!userId) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "user not found" });
        }
        const org = await ctx.db.org.findFirst({ where: { Users: { some: { id: userId } } } });
        if (!org) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Organizasyon Bulunamadı" });
        }
        const colors = await ctx.db.itemSize.findMany({ where: { orgId: org.id } })
        return colors
    }),
    addSize: protectedProcedure.input(z.object({ sizeCode: z.string().min(1), sizeText: z.string().min(1) })).mutation(async ({ ctx, input }) => {
        const userId = ctx.session?.user.id;
        if (!userId) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "user not found" });
        }
        const org = await ctx.db.org.findFirst({ where: { Users: { some: { id: userId } } } });
        if (!org) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Organizasyon Bulunamadı" });
        }
        return await ctx.db.itemSize.create({ data: { sizeCode: input.sizeCode, sizeText: input.sizeText, orgId: org.id } })
    }),
    getCategory: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session?.user.id;
        if (!userId) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "user not found" });
        }
        const org = await ctx.db.org.findFirst({ where: { Users: { some: { id: userId } } } });
        if (!org) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Organizasyon Bulunamadı" });
        }
        const categories = await ctx.db.itemCategory.findMany({ where: { orgId: org.id } })
        return categories
    }),
    addCategory: protectedProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
        const userId = ctx.session?.user.id;
        if (!userId) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "user not found" });
        }
        const org = await ctx.db.org.findFirst({ where: { Users: { some: { id: userId } } } });
        if (!org) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Organizasyon Bulunamadı" });
        }
        return await ctx.db.itemCategory.create({ data: { name: input, orgId: org.id } })
    }),
    getBrands: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session?.user.id;
        if (!userId) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "user not found" });
        }
        const org = await ctx.db.org.findFirst({ where: { Users: { some: { id: userId } } } });
        if (!org) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Organizasyon Bulunamadı" });
        }
        return await ctx.db.itemBrand.findMany({ where: { orgId: org.id } })

    }),
    addBrands: protectedProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
        const userId = ctx.session?.user.id;
        if (!userId) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "user not found" });
        }
        const org = await ctx.db.org.findFirst({ where: { Users: { some: { id: userId } } } });
        if (!org) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Organizasyon Bulunamadı" });
        }
        return await ctx.db.itemBrand.create({ data: { name: input, orgId: org.id } })
    }),
    addBarcode: protectedProcedure.input(z.object({ itemId: z.string().min(1), barcode: z.string().min(1), unit: z.string().min(1), quantity: z.string().min(1), isMaster: z.boolean() })).mutation(async ({ ctx, input }) => {
        const userId = ctx.session?.user.id;
        if (!userId) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "user not found" });
        }
        const org = await ctx.db.org.findFirst({ where: { Users: { some: { id: userId } } } });
        if (!org) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Organizasyon Bulunamadı" });
        }
        const getBarcode = await ctx.db.itemBarcode.findFirst({ where: { barcode: input.barcode } })
        if (getBarcode) {
            throw new TRPCError({ code: "CONFLICT", message: "Bu barkod kullanılıyor!" });
        }

        const masterBarcode = await ctx.db.itemBarcode.findFirst({ where: { isMaster: true, itemId: input.itemId } })
        if (masterBarcode) {
            await ctx.db.itemBarcode.update({ where: { id: masterBarcode.id }, data: { isMaster: false } })
        }
        return await ctx.db.itemBarcode.create({ data: { barcode: input.barcode, isMaster: input.isMaster, unit: input.unit, quantity: +input.quantity, itemId: input.itemId } })
    })
})