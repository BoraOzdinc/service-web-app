import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { PERMS } from "../../../_constants/perms"
import { $Enums } from "@prisma/client";


export const nonEmptyString = z.string().trim().min(1).max(150);

const addItemSchema = z.object({
    productName: nonEmptyString,
    barcode: nonEmptyString,
    itemCode: nonEmptyString,
    itemBrandId: nonEmptyString,
    storageId: z.string().optional(),
    itemColorId: nonEmptyString,
    itemSizeId: nonEmptyString,
    itemCategoryId: nonEmptyString,
    mainDealerPrice: z.number().optional(),
    multiPrice: z.number().optional(),
    dealerPrice: z.number().optional(),
    singlePrice: z.number().optional(),
    stock: z.number().optional(),
    isSerialNoRequired: z.boolean(),
    isServiceItem: z.boolean(),
    netWeight: z.string().optional(),
    volume: z.string().optional(),
});

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
    }))
})

export const itemsRouter = createTRPCRouter({
    getItems: protectedProcedure
        .input(z.object({ dealerId: z.string().optional(), orgId: z.string().optional(), searchInput: z.string() }))
        .query(async ({ ctx, input }) => {
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid Payload",
                });
            }
            const userPerms = ctx.session.permissions


            if (!userPerms.includes(PERMS.item_view)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }

            if (!userPerms.includes(PERMS.dealer_item_view) && !userPerms.includes(PERMS.item_view)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }


            return await ctx.db.item.findMany({
                where: { orgId: ctx.session.orgId, dealerId: ctx.session.dealerId },
                include: {
                    ItemStock: { select: { stock: true, storage: true } },
                    color: true,
                    size: true,
                    category: true,
                    itemBarcode: true,
                    brand: true,
                }
            })

        }),
    getItemWithBarcode: protectedProcedure
        .input(z.object({ dealerId: z.string().optional(), orgId: z.string().optional(), barcode: nonEmptyString }))
        .query(async ({ ctx, input }) => {
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid Payload",
                });
            }
            const userPerms = ctx.session.permissions

            if (input.dealerId) {
                if (!userPerms.includes(PERMS.item_accept)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
            }
            if (input.orgId) {
                if (!userPerms.includes(PERMS.item_accept)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }

            }
            return await ctx.db.item.findFirst({
                where: { dealerId: input.dealerId, orgId: input.orgId, itemBarcode: { some: { barcode: input.barcode } } },
                include: {
                    ItemStock: { select: { stock: true, storage: true } },
                    itemBarcode: true,
                    color: true,
                    size: true
                },

            })
        }),
    getItemWithId: protectedProcedure
        .input(nonEmptyString)
        .query(async ({ ctx, input }) => {
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid Payload",
                });
            }
            const userPerms = ctx.session.permissions


            if (Boolean(ctx.session.dealerId)) {
                if (!userPerms.includes(PERMS.item_view)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
            }
            if (Boolean(ctx.session.orgId)) {
                if (!userPerms.includes(PERMS.dealer_item_view) && !userPerms.includes(PERMS.item_view)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
            }

            const item = await ctx.db.item.findFirst({
                where: { id: input, OR: [{ orgId: ctx.session.orgId }, { dealerId: ctx.session.dealerId }] },
                include: {
                    brand: true,
                    category: true,
                    color: true,
                    itemBarcode: true,
                    ItemHistory: { include: { fromStorage: true, toStorage: true, item: true, org: true, } },
                    ItemStock: { include: { storage: true } },
                    size: true,
                }
            })
            if (!item) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }

            return item


        }),
    getStorages: protectedProcedure.query(async ({ ctx }) => {

        const userPerms = ctx.session.permissions

        if (!userPerms.includes(PERMS.item_view)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }

        if (ctx.session.orgId) {

            const Storages = await ctx.db.storage.findMany({
                where: { orgId: ctx.session.orgId },
            });

            return Storages
        }
        if (ctx.session.dealerId) {

            const Storages = await ctx.db.storage.findMany({
                where: { dealerId: ctx.session.dealerId },
            });

            return Storages
        }
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Neither org member or dealer member",
        });
    }),
    addStorage: protectedProcedure
        .input(
            z.object({
                name: nonEmptyString,
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const userPerms = ctx.session.permissions

            if (ctx.session.orgId) {
                if (!userPerms.includes(PERMS.manage_storage)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                return await ctx.db.storage.create({
                    data: { name: input.name, orgId: ctx.session.orgId },
                });
            }
            if (ctx.session.dealerId) {
                if (!userPerms.includes(PERMS.manage_storage)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                return await ctx.db.storage.create({
                    data: { name: input.name, dealerId: ctx.session.dealerId },
                });
            }

            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Neither org member or dealer member",
            });
        }),
    deleteStorage: protectedProcedure
        .input(nonEmptyString)
        .mutation(async ({ ctx, input }) => {
            const userPerms = ctx.session.permissions

            if (ctx.session.orgId) {
                if (!userPerms.includes(PERMS.manage_storage)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                return await ctx.db.storage.delete({
                    where: { id: input }
                });
            }
            if (ctx.session.dealerId) {
                if (!userPerms.includes(PERMS.manage_storage)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                return await ctx.db.storage.delete({
                    where: { id: input }
                });
            }

            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Neither org member or dealer member",
            });
        }),
    addItem: protectedProcedure
        .input(addItemSchema)
        .mutation(async ({ ctx, input }) => {
            const userPerms = ctx.session.permissions

            if (!userPerms.includes(PERMS.manage_items)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            if (ctx.session.orgId) {
                const sameBarcodedItem = await ctx.db.itemBarcode.findFirst({
                    where: {
                        barcode: input.barcode,
                        item: {
                            orgId: ctx.session.orgId
                        }
                    },
                    include: { item: true }
                });
                if (sameBarcodedItem) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Aynı barkoda sahip bir ürün var!",
                    });
                }
                const item = await ctx.db.item.create({
                    data: {
                        orgId: ctx.session.orgId,
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
                    },
                });
                const itemBarcode = await ctx.db.itemBarcode.create({
                    data: {
                        isMaster: true,
                        barcode: input.barcode,
                        quantity: 1,
                        unit: "Adet",
                        itemId: item.id,
                    },
                });
                if (input.storageId && input.stock) {
                    const storage = await ctx.db.storage.findFirst({
                        where: { id: input.storageId },
                    });
                    if (!storage) {
                        throw new TRPCError({
                            code: "BAD_REQUEST",
                            message: "Depo Bulunamadı!",
                        });
                    }
                    await ctx.db.itemStock.create({
                        data: { stock: input.stock, itemId: item.id, storageId: storage.id },
                    });
                }
                await ctx.db.itemHistory.create({
                    data: {
                        action: "AddItem",
                        createdBy: ctx.session.email ?? "Bilinmeyen Kullanıcı",
                        description: "",
                        quantity: input.stock ?? 0,
                        toStorageId: input.storageId,
                        itemId: item.id,
                        orgId: ctx.session.orgId,
                        dealerId: ctx.session.dealerId
                    }
                })
                return [item, itemBarcode];
            }
            if (ctx.session.dealerId) {
                const sameBarcodedItem = await ctx.db.itemBarcode.findFirst({
                    where: {
                        barcode: input.barcode,
                        item: {
                            dealerId: ctx.session.dealerId
                        }
                    },
                    include: { item: true }
                });
                if (sameBarcodedItem) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Aynı barkoda sahip bir ürün var!",
                    });
                }
                const item = await ctx.db.item.create({
                    data: {
                        dealerId: ctx.session.dealerId,
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
                    },
                });
                const itemBarcode = await ctx.db.itemBarcode.create({
                    data: {
                        isMaster: true,
                        barcode: input.barcode,
                        quantity: 1,
                        unit: "Adet",
                        itemId: item.id,
                    },
                });
                if (input.storageId && input.stock) {
                    const storage = await ctx.db.storage.findFirst({
                        where: { id: input.storageId },
                    });
                    if (!storage) {
                        throw new TRPCError({
                            code: "BAD_REQUEST",
                            message: "Depo Bulunamadı!",
                        });
                    }
                    await ctx.db.itemStock.create({
                        data: { stock: input.stock, itemId: item.id, storageId: storage.id },
                    });
                }
                await ctx.db.itemHistory.create({
                    data: {
                        action: "AddItem",
                        createdBy: ctx.session.email ?? "Bilinmeyen Kullanıcı",
                        description: "",
                        quantity: input.stock ?? 0,
                        toStorageId: input.storageId,
                        itemId: item.id,
                        orgId: ctx.session.orgId,
                        dealerId: ctx.session.dealerId
                    }
                })
                return [item, itemBarcode];
            }

            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });

        }),
    updateItem: protectedProcedure
        .input(
            z.object({
                itemId: z.string().min(1),
                productName: nonEmptyString,
                itemCode: nonEmptyString,
                itemBrandId: nonEmptyString,
                storageId: z.string().optional(),
                itemColorId: nonEmptyString,
                itemSizeId: nonEmptyString,
                itemCategoryId: nonEmptyString,
                mainDealerPrice: z.number().optional(),
                multiPrice: z.number().optional(),
                dealerPrice: z.number().optional(),
                singlePrice: z.number().optional(),
                stock: z.number().optional(),
                isSerialNoRequired: z.boolean(),
                isServiceItem: z.boolean(),
                netWeight: z.string().optional(),
                volume: z.string().optional(),
                description: nonEmptyString
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const userPerms = ctx.session.permissions

            if (!userPerms.includes(PERMS.manage_items)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            if (ctx.session.orgId) {
                const item = await ctx.db.item.update({
                    where: { id: input.itemId },
                    data: {
                        orgId: ctx.session.orgId,
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
                    },
                });
                await ctx.db.itemHistory.create({
                    data: {
                        action: "UpdateItem",
                        createdBy: ctx.session.email ?? "Bilinmeyen Kullanıcı",
                        description: input.description,
                        quantity: input.stock ?? 0,
                        toStorageId: input.storageId,
                        itemId: item.id,
                        orgId: ctx.session.orgId,
                        dealerId: ctx.session.dealerId
                    }
                })
                return item
            }
            if (ctx.session.dealerId) {
                const item = await ctx.db.item.update({
                    where: { id: input.itemId },
                    data: {
                        dealerId: ctx.session.dealerId,
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
                    },
                });
                await ctx.db.itemHistory.create({
                    data: {
                        action: "UpdateItem",
                        createdBy: ctx.session.email ?? "Bilinmeyen Kullanıcı",
                        description: input.description,
                        quantity: input.stock ?? 0,
                        toStorageId: input.storageId,
                        itemId: item.id,
                        orgId: ctx.session.orgId,
                        dealerId: ctx.session.dealerId
                    }
                })
                return item
            }

            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }),
    getColors: protectedProcedure.query(async ({ ctx }) => {
        const userPerms = ctx.session.permissions
        if (ctx.session.orgId) {
            if (!userPerms.includes(PERMS.item_setting_view)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.itemColor.findMany({ where: { orgId: ctx.session.orgId } })
        }

        if (ctx.session.dealerId) {
            if (!userPerms.includes(PERMS.item_setting_view)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.itemColor.findMany({ where: { dealerId: ctx.session.dealerId } })
        }
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You don't have permission to do this!",
        });
    }),
    addColor: protectedProcedure
        .input(
            z.object({ colorCode: z.string().min(1), colorText: z.string().min(1) }),
        )
        .mutation(async ({ ctx, input }) => {
            const userPerms = ctx.session.permissions
            if (ctx.session.orgId) {
                if (!userPerms.includes(PERMS.manage_item_setting)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                return await ctx.db.itemColor.create({ data: { orgId: ctx.session.orgId, colorCode: input.colorCode, colorText: input.colorText } })
            }

            if (ctx.session.dealerId) {
                if (!userPerms.includes(PERMS.manage_item_setting)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                return await ctx.db.itemColor.create({ data: { dealerId: ctx.session.dealerId, colorCode: input.colorCode, colorText: input.colorText } })
            }
        }),
    getSizes: protectedProcedure.query(async ({ ctx }) => {
        const userPerms = ctx.session.permissions
        if (ctx.session.orgId) {
            if (!userPerms.includes(PERMS.item_setting_view)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.itemSize.findMany({ where: { orgId: ctx.session.orgId } })
        }

        if (ctx.session.dealerId) {
            if (!userPerms.includes(PERMS.item_setting_view)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.itemSize.findMany({ where: { dealerId: ctx.session.dealerId } })
        }
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You don't have permission to do this!",
        });
    }),
    addSize: protectedProcedure
        .input(
            z.object({ sizeCode: z.string().min(1), sizeText: z.string().min(1) }),
        )
        .mutation(async ({ ctx, input }) => {
            const userPerms = ctx.session.permissions
            if (ctx.session.orgId) {
                if (!userPerms.includes(PERMS.manage_item_setting)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                return await ctx.db.itemSize.create({ data: { orgId: ctx.session.orgId, sizeCode: input.sizeCode, sizeText: input.sizeText } })
            }

            if (ctx.session.dealerId) {
                if (!userPerms.includes(PERMS.manage_item_setting)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                return await ctx.db.itemSize.create({ data: { dealerId: ctx.session.dealerId, sizeCode: input.sizeCode, sizeText: input.sizeText } })
            }
        }),
    getCategory: protectedProcedure.query(async ({ ctx }) => {
        const userPerms = ctx.session.permissions
        if (ctx.session.orgId) {
            if (!userPerms.includes(PERMS.item_setting_view)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.itemCategory.findMany({ where: { orgId: ctx.session.orgId } })
        }

        if (ctx.session.dealerId) {
            if (!userPerms.includes(PERMS.item_setting_view)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.itemCategory.findMany({ where: { dealerId: ctx.session.dealerId } })
        }
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You don't have permission to do this!",
        });
    }),
    addCategory: protectedProcedure
        .input(z.string().min(1))
        .mutation(async ({ ctx, input }) => {
            const userPerms = ctx.session.permissions
            if (ctx.session.orgId) {
                if (!userPerms.includes(PERMS.manage_item_setting)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                return await ctx.db.itemCategory.create({ data: { orgId: ctx.session.orgId, name: input } })
            }

            if (ctx.session.dealerId) {
                if (!userPerms.includes(PERMS.manage_item_setting)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                return await ctx.db.itemCategory.create({ data: { dealerId: ctx.session.dealerId, name: input } })
            }
        }),
    getBrands: protectedProcedure.query(async ({ ctx }) => {
        const userPerms = ctx.session.permissions
        if (ctx.session.orgId) {
            if (!userPerms.includes(PERMS.item_setting_view)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.itemBrand.findMany({ where: { orgId: ctx.session.orgId } })
        }

        if (ctx.session.dealerId) {
            if (!userPerms.includes(PERMS.item_setting_view)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.itemBrand.findMany({ where: { dealerId: ctx.session.dealerId } })
        }
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You don't have permission to do this!",
        });
    }),
    addBrands: protectedProcedure
        .input(z.string().min(1))
        .mutation(async ({ ctx, input }) => {
            const userPerms = ctx.session.permissions
            if (ctx.session.orgId) {
                if (!userPerms.includes(PERMS.manage_item_setting)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                return await ctx.db.itemBrand.create({ data: { orgId: ctx.session.orgId, name: input } })
            }

            if (ctx.session.dealerId) {
                if (!userPerms.includes(PERMS.manage_item_setting)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                return await ctx.db.itemBrand.create({ data: { dealerId: ctx.session.dealerId, name: input } })
            }
        }),
    addBarcode: protectedProcedure
        .input(
            z.object({
                itemId: z.string().min(1),
                barcode: z.string().min(1),
                unit: z.string().min(1),
                quantity: z.string().min(1),
                isMaster: z.boolean(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const userPerms = ctx.session.permissions

            if (!userPerms.includes(PERMS.manage_items)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            const getBarcode = await ctx.db.itemBarcode.findFirst({
                where: { barcode: input.barcode },
            });
            if (getBarcode) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Bu barkod kullanılıyor!",
                });
            }

            const masterBarcode = await ctx.db.itemBarcode.findFirst({
                where: { isMaster: true, itemId: input.itemId },
            });
            if (input.isMaster && masterBarcode) {
                await ctx.db.itemBarcode.update({
                    where: { id: masterBarcode.id },
                    data: { isMaster: false },
                });
            }
            return await ctx.db.itemBarcode.create({
                data: {
                    barcode: input.barcode,
                    isMaster: input.isMaster,
                    unit: input.unit,
                    quantity: +input.quantity,
                    itemId: input.itemId,
                },
            });
        }),
    updateBarcode: protectedProcedure.input(z.object({
        barcodeId: z.string().min(1),
        barcode: z.string().min(1),
        unit: z.string().min(1),
        quantity: z.string().min(1),
        isMaster: z.boolean(),
    })).mutation(async ({ input, ctx }) => {
        const userPerms = ctx.session.permissions

        if (!userPerms.includes(PERMS.manage_items)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        const barcode = await ctx.db.itemBarcode.findUnique({ where: { id: input.barcodeId } })
        if (!barcode) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Barkod Bulunamadı!",
            });
        }
        const masterBarcode = await ctx.db.itemBarcode.findFirst({
            where: { isMaster: true, itemId: barcode.itemId },
        });
        if (input.isMaster && masterBarcode) {
            await ctx.db.itemBarcode.update({
                where: { id: masterBarcode.id },
                data: { isMaster: false },
            });
        }
        return await ctx.db.itemBarcode.update({
            where: { id: input.barcodeId },
            data: {
                barcode: input.barcode,
                isMaster: input.isMaster,
                quantity: Number(input.quantity),
                unit: input.unit
            }
        })
    }),
    itemAccept: protectedProcedure
        .input(
            /* {
                storageId:string
                fromCustomerId:string
                items:[
                    {
                        itemId:string,
                        barcode:string
                        quantity:number
                    }
                ]
            }*/
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

            const storage = await ctx.db.storage.findFirst({
                where: {
                    AND: [{
                        OR: [
                            { orgId: ctx.session.orgId },
                            { dealerId: ctx.session.dealerId }]
                    },
                    { id: input.storageId }]
                },
                include: { ItemStock: { include: { item: true } } }
            })
            if (!storage) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            const history = await ctx.db.itemAcceptHistory.create({
                data: {
                    orgId: ctx.session.orgId,
                    dealerId: ctx.session.dealerId,
                    name: ctx.session.email ?? "Bilinmeyen Kullanıcı",
                    storageId: storage.id,
                    customerId: input.fromCustomerId
                }
            });
            input.items.map(async (i) => {
                const existingItemStock = await ctx.db.itemStock.findFirst({
                    where: {
                        AND: [{
                            OR: [
                                { item: { orgId: ctx.session.orgId } },
                                { item: { dealerId: ctx.session.dealerId } }]
                        },
                        { itemId: i.itemId }]
                    }
                })
                const barcodeDetails = await ctx.db.itemBarcode.findFirst({
                    where: {
                        AND: [{ barcode: i.barcode },
                        {
                            OR: [
                                { item: { orgId: ctx.session.orgId } },
                                { item: { dealerId: ctx.session.dealerId } }
                            ]
                        }]
                    }
                })

                if (!barcodeDetails) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                if (existingItemStock) {
                    await ctx.db.itemStock.update({ where: { id: existingItemStock.id }, data: { stock: (i.quantity * barcodeDetails.quantity) + existingItemStock.stock } })
                } else {
                    await ctx.db.itemStock.create({ data: { itemId: i.itemId, stock: i.quantity * barcodeDetails.quantity, storageId: storage.id } })
                }
                await ctx.db.itemAcceptDetail.create({
                    data: {
                        itemId: i.itemId,
                        itemAcceptHistoryId: history.id,
                        itemBarcodeId: barcodeDetails.id,
                        quantity: i.quantity,
                    }
                })

            })
            return history
        }),
    getItemAcceptHistory: protectedProcedure.query(async ({ ctx }) => {
        const userPerms = ctx.session.permissions

        if (!userPerms.includes(PERMS.item_accept_history_view)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        return await ctx.db.itemAcceptHistory.findMany({
            where: {
                OR: [
                    { orgId: ctx.session.orgId },
                    { dealerId: ctx.session.dealerId }
                ]
            },
            orderBy: { createDate: "desc" },
            include: {
                items: {
                    include: { item: true, itemBarcode: true }
                },

                storage: true,
                from: { select: { companyName: true, name: true, surname: true } }
            }
        })
    }),
    getItemSellHistory: protectedProcedure.query(async ({ ctx }) => {
        const userPerms = ctx.session.permissions

        if (!userPerms.includes(PERMS.item_sell_history_view)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        return await ctx.db.itemSellHistory.findMany({
            where: {
                OR: [
                    { orgId: ctx.session.orgId },
                    { dealerId: ctx.session.dealerId }
                ]
            },
            orderBy: { createDate: "desc" },
            include: {
                connectedTransaction: true,
                items: { include: { item: { include: { itemBarcode: true } } } },
                to: true,
                storage: true
            }
        })
    }),
    itemSell: protectedProcedure.input(itemSellSchema).mutation(async ({ input, ctx }) => {
        const userPerms = ctx.session.permissions

        if (!userPerms.includes(PERMS.item_sell)) {

        }
        const customer = await ctx.db.customer.findUnique({ where: { id: input.customerId } })
        if (!customer) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        const storage = await ctx.db.storage.findUnique({ where: { id: input.storageId } })
        if (!storage) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        const priceEnum = z.nativeEnum($Enums.PriceType);
        const priceType = priceEnum.parse(input.selectedPriceType);

        if (!input.saleCancel) {
            input.items.map(async (i) => {
                const itemStock = await ctx.db.itemStock.findFirst({ where: { itemId: i.itemId, storageId: storage.id } })
                if (!itemStock) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                const remainingStock = itemStock.stock - i.totalAdded
                if (remainingStock < 0) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Deponuzdaki Ürünler Yeterli Değil",
                    });
                }
                await ctx.db.itemStock.update({ where: { id: itemStock?.id }, data: { stock: remainingStock } })
            })
        }

        const transaction = await ctx.db.transaction.create({
            data: {
                dealerId: input.transferToDealer ? customer.connectedDealerId : null,
                customerId: customer.id,
                discount: String(input.discount),
                exchangeRate: String(input.exchangeRate),
                priceType: priceType,
                storageId: input.storageId,
                totalAmount: String(input.totalPayAmount),
                transactionType: input.saleCancel ? "Cancel" : "Sale",
                payAmount: String(input.paidAmount),
                boughtItems: { createMany: { data: input.items.map(i => ({ itemId: i.itemId, price: String(i.price), quantity: i.totalAdded })) } }
            }
        })
        const sellHistory = await ctx.db.itemSellHistory.create({
            data: {
                name: ctx.session.email ?? "Bilinmeyen Kullanıcı",
                customerId: customer.id,
                orgId: ctx.session.orgId,
                dealerId: ctx.session.dealerId,
                storageId: storage.id,
                transactionType: input.saleCancel ? "Cancel" : "Sale",
                transactionId: transaction.id,
                items: {
                    createMany: {
                        data: input.items.map(i => {
                            return { itemId: i.itemId, quantity: i.totalAdded }
                        })
                    }
                }
            }
        })
        return [transaction, sellHistory]
    }),
    itemCount: protectedProcedure.input(
        z.object({
            storageId: nonEmptyString,
            items: z.object({
                itemId: nonEmptyString,
                barcode: nonEmptyString,
                totalAdded: z.number().min(1),
            }).array().min(1)
        })).mutation(async ({ ctx, input }) => {

            if (!ctx.session.permissions.includes(PERMS.manage_items)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            await ctx.db.itemStock.deleteMany({ where: { storageId: input.storageId } })
            return await ctx.db.itemStock.createMany({ data: input.items.map(i => ({ itemId: i.itemId, stock: i.totalAdded, storageId: input.storageId })) })
        })

});
