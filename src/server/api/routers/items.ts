import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { PERMS } from "../../../_constants/perms"
import { $Enums } from "@prisma/client";
import { isAuthorised } from "~/utils";
import { createId } from '@paralleldrive/cuid2';

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
    netWeight: z.number().optional(),
    volume: z.number().optional(),
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
        serialNumbers: z.string().array()
    }))
})

export const itemsRouter = createTRPCRouter({
    getItems: protectedProcedure
        .input(z.object({
            dealerId: z.string().optional(),
            orgId: z.string().optional(),
            searchInput: z.string(),
        }))
        .query(async ({ ctx, input }) => {
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid Payload",
                });
            }
            const userPerms = ctx.session.permissions

            if (input.dealerId && userPerms.includes(PERMS.dealer_item_view)) {
                const isUserAuthorised = await isAuthorised(ctx.supabase, ctx.session.orgId ?? "", input.dealerId ?? "")
                if (!isUserAuthorised) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }

                const { data } = await ctx.supabase
                    .from("Item")
                    .select("id,name,itemCode,mainDealerPrice,multiPrice,dealerPrice,singlePrice,ItemColor(colorCode,colorText),ItemSize(sizeCode,sizeText),ItemCategory(name),ItemBrand(name),ItemStock(stock,Storage(id,name)),itemBarcode(id,barcode,isMaster)")
                    .eq("orgId", input.dealerId)

                if (data) {
                    return data
                        .filter(
                            (o) =>
                                (o.itemBarcode.find((b) =>
                                    b.barcode
                                        .toLowerCase()
                                        .includes(input.searchInput.toLowerCase()),
                                ) ??
                                    o.itemCode
                                        .toLowerCase()
                                        .includes(input.searchInput.toLowerCase())) ||
                                o.name.toLowerCase().includes(input.searchInput.toLowerCase()),
                        )
                        .map((o) => {
                            const totalStock = o.ItemStock.reduce((sum, s) => sum + s.stock, 0);
                            return { ...o, totalStock };
                        })
                        .sort((a, b) => b.totalStock - a.totalStock);
                }

            }
            if (input.orgId && userPerms.includes(PERMS.item_view)) {
                if (ctx.session.orgId === input.orgId) {
                    const { data } = await ctx.supabase
                        .from("Item")
                        .select("id,name,itemCode,mainDealerPrice,multiPrice,dealerPrice,singlePrice,ItemColor(colorCode,colorText),ItemSize(sizeCode,sizeText),ItemCategory(name),ItemBrand(name),ItemStock(stock,Storage(id,name)),itemBarcode(id,barcode,isMaster)")
                        .eq("orgId", input.orgId)

                    if (data) {
                        return data
                            .filter(
                                (o) =>
                                    (o.itemBarcode.find((b) =>
                                        b.barcode
                                            .toLowerCase()
                                            .includes(input.searchInput.toLowerCase()),
                                    ) ??
                                        o.itemCode
                                            .toLowerCase()
                                            .includes(input.searchInput.toLowerCase())) ||
                                    o.name.toLowerCase().includes(input.searchInput.toLowerCase()),
                            )
                            .map((o) => {
                                const totalStock = o.ItemStock.reduce((sum, s) => sum + s.stock, 0);
                                return { ...o, totalStock };
                            })
                            .sort((a, b) => b.totalStock - a.totalStock);
                    }
                }
            }
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
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

            if (input.dealerId && userPerms.includes(PERMS.dealer_item_view)) {
                const isUserAuthorised = await isAuthorised(ctx.supabase, ctx.session.orgId ?? "", input.dealerId ?? "")
                if (!isUserAuthorised) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }

                const { data } = await ctx.supabase
                    .from("Item")
                    .select("*,ItemColor(*),ItemSize(*),ItemCategory(*),ItemBrand(*),ItemStock(*,Storage(*)),itemBarcode(*)")
                    .eq("orgId", input.dealerId)


                return data?.find(i => i.itemBarcode.find(b => b.barcode === input.barcode))

            }
            if (input.orgId && userPerms.includes(PERMS.item_view)) {
                if (ctx.session.orgId === input.orgId) {
                    const { data } = await ctx.supabase
                        .from("Item")
                        .select("*,ItemColor(*),ItemSize(*),ItemCategory(*),ItemBrand(*),ItemStock(*,Storage(*)),itemBarcode(*)")
                        .eq("orgId", input.orgId)

                    return data?.find(i => i.itemBarcode.find(b => b.barcode === input.barcode))

                }
            }
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
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


            if (userPerms.includes(PERMS.item_view)) {
                const { data: itemDetails, error: itemDetailsError } = await ctx.supabase
                    .from("Item")
                    .select("name,itemBrandId,itemCode,mainDealerPrice,multiPrice,dealerPrice,singlePrice,isSerialNoRequired,isServiceItem,itemColorId,itemSizeId,itemCategoryId,itemBrandId,orgId,netWeight,volume,image,serviceItemList,ItemStock(*,Storage(*)),itemBarcode(*)")
                    .eq("id", input)
                    .maybeSingle()
                if (itemDetailsError) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Failed to get item details",
                    });
                }
                if (!itemDetails?.orgId) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Item could not found!",
                    });
                }
                if (itemDetails.orgId === ctx.session.orgId ?? "") {
                    const colors = (await ctx.supabase.from("ItemColor").select("id,colorCode,colorText").eq("orgId", itemDetails.orgId)).data
                    const sizes = (await ctx.supabase.from("ItemSize").select("id,sizeCode,sizeText").eq("orgId", itemDetails.orgId)).data
                    const categories = (await ctx.supabase.from("ItemCategory").select("id,name").eq("orgId", itemDetails.orgId)).data
                    const brands = (await ctx.supabase.from("ItemBrand").select("id,name").eq("orgId", itemDetails.orgId)).data
                    const serviceItemsList = (await ctx.supabase.from("Item").select("id,name").in("id", itemDetails.serviceItemList ?? [])).data
                    const serviceItems = itemDetails.serviceItemList ? serviceItemsList?.sort((a, b) => {
                        return (itemDetails.serviceItemList?.indexOf(a.id) ?? -1) - (itemDetails.serviceItemList?.indexOf(b.id) ?? -1);
                    }) : [];
                    return { itemDetails, colors, sizes, categories, brands, serviceItems }
                }

            }
            if (userPerms.includes(PERMS.dealer_item_view)) {
                const { data } = await ctx.supabase
                    .from("Item")
                    .select("name,itemBrandId,itemCode,mainDealerPrice,multiPrice,dealerPrice,singlePrice,isSerialNoRequired,isServiceItem,itemColorId,itemSizeId,itemCategoryId,itemBrandId,orgId,netWeight,volume,image,serviceItemList,ItemStock(*,Storage(*)),itemBarcode(*)")
                    .eq("id", input)
                    .maybeSingle()
                if (!data?.orgId) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Item could not found!",
                    });
                }
                const isUserAuthorised = await isAuthorised(ctx.supabase, ctx.session.orgId ?? "", data.orgId)
                if (!isUserAuthorised) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this! authorisation",
                    });
                }
                const colors = (await ctx.supabase.from("ItemColor").select("id,colorCode,colorText").eq("orgId", data.orgId)).data
                const sizes = (await ctx.supabase.from("ItemSize").select("id,sizeCode,sizeText").eq("orgId", data.orgId)).data
                const categories = (await ctx.supabase.from("ItemCategory").select("id,name").eq("orgId", data.orgId)).data
                const brands = (await ctx.supabase.from("ItemBrand").select("id,name").eq("orgId", data.orgId)).data

                const serviceItemsList = (await ctx.supabase.from("Item").select("id,name").in("id", data.serviceItemList ?? [])).data
                const serviceItems = data.serviceItemList ? serviceItemsList?.sort((a, b) => {
                    return (data.serviceItemList?.indexOf(a.id) ?? -1) - (data.serviceItemList?.indexOf(b.id) ?? -1);
                }) : [];
                return { itemDetails: data, colors, sizes, categories, brands, serviceItems }
            }
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }),

    getStorages: protectedProcedure.input(z.object({ itemId: z.string().optional() })).query(async ({ ctx, input: { itemId } }) => {
        const userPerms = ctx.session.permissions

        if (!userPerms.includes(PERMS.manage_storage)) {
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
        if (itemId) {
            const item = (await ctx.supabase.from("Item").select("orgId").eq("id", itemId).maybeSingle()).data;
            if (!item) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Item could not found!",
                });
            }
            if (item.orgId === ctx.session.orgId) {
                const { data, error } = await ctx.supabase.from("Storage").select("id,name").eq("orgId", item.orgId)
                if (error) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Failed to get storage",
                    });
                }
                return data
            }
            const isUserAuthorised = await isAuthorised(ctx.supabase, ctx.session.orgId ?? "", item.orgId ?? "")
            if (!isUserAuthorised) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }

            const { data: dealerStorages, error: dealerStoragesError } = await ctx.supabase.from("Storage").select("id,name").eq("orgId", item.orgId ?? "")
            if (dealerStoragesError) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Failed to get dealer storage",
                });
            }
            return dealerStorages
        }
        const { data: orgStorages, error: orgStoragesError } = await ctx.supabase.from("Storage").select("id,name").eq("orgId", ctx.session.orgId)
        if (orgStoragesError) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to get org storage",
            });
        }
        return orgStorages

    }),

    addStorage: protectedProcedure
        .input(
            z.object({
                name: nonEmptyString,
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const userPerms = ctx.session.permissions

            if (!ctx.session.orgId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            if (!userPerms.includes(PERMS.manage_storage)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            const { error } = await ctx.supabase.from("Storage").insert({ id: createId(), name: input.name, orgId: ctx.session.orgId })
            if (error) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Error creating storage: " + error.message });
            }
            return "success"


        }),
    deleteStorage: protectedProcedure
        .input(nonEmptyString)
        .mutation(async ({ ctx, input }) => {
            const userPerms = ctx.session.permissions

            if (ctx.session.orgId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            if (!userPerms.includes(PERMS.manage_storage)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            const { error } = await ctx.supabase.from("Storage").delete().eq("id", input)
            if (error) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Error deleting storage: " + error.message });
            }
            return "success"
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
                const sameBarcodedItem = (await ctx.supabase.from("itemBarcode").select("id,Item(orgId)").eq("barcode", input.barcode).maybeSingle()).data
                if (sameBarcodedItem) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Aynı barkoda sahip bir ürün var!",
                    });
                }
                const itemData = {
                    id: createId(),
                    orgId: ctx.session.orgId,
                    itemBrandId: input.itemBrandId,
                    name: input.productName,
                    itemCode: input.itemCode,
                    dealerPrice: input.dealerPrice ?? null,
                    mainDealerPrice: input.mainDealerPrice ?? null,
                    multiPrice: input.multiPrice ?? null,
                    singlePrice: input.singlePrice ?? null,
                    isSerialNoRequired: input.isSerialNoRequired,
                    isServiceItem: input.isServiceItem,
                    itemColorId: input.itemColorId,
                    itemSizeId: input.itemSizeId,
                    netWeight: input.netWeight,
                    volume: input.volume,
                    itemCategoryId: input.itemCategoryId,
                    updateDate: new Date().toUTCString(),
                    createDate: new Date().toUTCString()
                };
                const { data: item, error } = await ctx.supabase.from("Item").insert(itemData).select("*").single()
                if (error) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Error creating item: " + error.message
                    })
                }
                const { data: itemBarcode, error: itemBarcodeError } = await ctx.supabase.from("itemBarcode").insert({
                    id: createId(),
                    itemId: item.id,
                    barcode: input.barcode,
                    unit: "Adet",
                    quantity: 1,
                    isMaster: true,
                })
                if (itemBarcodeError) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Error creating item barcode: " + itemBarcodeError.message
                    })
                }
                if (input.storageId && input.stock) {
                    const storage = (await ctx.supabase.from("Storage").select("*").eq("id", input.storageId).maybeSingle()).data

                    if (!storage) {
                        throw new TRPCError({
                            code: "BAD_REQUEST",
                            message: "Depo Bulunamadı!",
                        });
                    }
                    await ctx.supabase.from("ItemStock").insert({ id: createId(), itemId: item.id, storageId: storage.id, stock: input.stock })

                }

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
                netWeight: z.number().optional(),
                volume: z.number().optional(),
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
                const item = (await ctx.supabase.from("Item").select("orgId").eq("id", input.itemId).single()).data
                if (item?.orgId !== ctx.session.orgId) {
                    const isUserAuthorised = await isAuthorised(ctx.supabase, ctx.session.orgId ?? "", item?.orgId ?? "")
                    if (!isUserAuthorised) {
                        throw new TRPCError({
                            code: "UNAUTHORIZED",
                            message: "You don't have permission to do this!",
                        });
                    }
                }
                return await ctx.supabase.from("Item").update({
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
                }).eq("id", input.itemId)
            }
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }),
    getItemSettingsDetails: protectedProcedure.query(async ({ ctx }) => {
        const userPerms = ctx.session.permissions

        if (!userPerms.includes(PERMS.manage_items)) {
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
        const { data: colors, error: colorsError } = await ctx.supabase.from("ItemColor").select("id,colorCode,colorText").eq("orgId", ctx.session.orgId)
        if (colorsError) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to get item colors",
            });
        }
        const { data: sizes, error: sizesError } = await ctx.supabase.from("ItemSize").select("id,sizeCode,sizeText").eq("orgId", ctx.session.orgId)
        if (sizesError) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to get item sizes",
            });
        }
        const { data: categories, error: categoriesError } = await ctx.supabase.from("ItemCategory").select("id,name").eq("orgId", ctx.session.orgId)
        if (categoriesError) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to get item categories",
            });
        }
        const { data: brands, error: brandsError } = await ctx.supabase.from("ItemBrand").select("id,name").eq("orgId", ctx.session.orgId)
        if (brandsError) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to get item brands",
            });
        }
        const { data: storages, error: storagesError } = await ctx.supabase.from("Storage").select("id,name").eq("orgId", ctx.session.orgId)
        if (storagesError) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to get storages",
            });
        }
        return {
            colors,
            sizes,
            categories,
            brands,
            storages
        }

    }),
    getColors: protectedProcedure.input(z.object({ itemId: z.string().optional() })).query(async ({ ctx, input: { itemId } }) => {
        const userPerms = ctx.session.permissions

        if (!userPerms.includes(PERMS.item_setting_view)) {
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
        if (itemId) {
            const item = (await ctx.supabase.from("Item").select("orgId").eq("id", itemId).maybeSingle()).data;
            if (!item) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Item could not found!",
                });
            }
            if (item.orgId === ctx.session.orgId) {
                return (await ctx.supabase.from("ItemColor").select("*").eq("orgId", item.orgId)).data
            }
            const isUserAuthorised = await isAuthorised(ctx.supabase, ctx.session.orgId ?? "", item.orgId ?? "")
            if (!isUserAuthorised) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return (await ctx.supabase.from("ItemColor").select("*").eq("orgId", item.orgId ?? "")).data

        }
        return (await ctx.supabase.from("ItemColor").select("*").eq("orgId", ctx.session.orgId)).data

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
                await ctx.supabase.from("ItemColor").insert({
                    id: createId(), orgId: ctx.session.orgId, colorCode: input.colorCode, colorText: input.colorText
                })
                return "success"
            }

        }),
    getSizes: protectedProcedure.input(z.object({ itemId: z.string().optional() })).query(async ({ ctx, input: { itemId } }) => {
        const userPerms = ctx.session.permissions

        if (!userPerms.includes(PERMS.item_setting_view)) {
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
        if (itemId) {
            const item = (await ctx.supabase.from("Item").select("orgId").eq("id", itemId).maybeSingle()).data;
            if (!item) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Item could not found!",
                });
            }
            if (item.orgId === ctx.session.orgId) {
                return (await ctx.supabase.from("ItemSize").select("*").eq("orgId", item.orgId)).data
            }
            const isUserAuthorised = await isAuthorised(ctx.supabase, ctx.session.orgId ?? "", item.orgId ?? "")
            if (!isUserAuthorised) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return (await ctx.supabase.from("ItemSize").select("*").eq("orgId", item.orgId ?? "")).data

        }
        return (await ctx.supabase.from("ItemSize").select("*").eq("orgId", ctx.session.orgId)).data

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
                await ctx.supabase.from("ItemSize").insert({ id: createId(), orgId: ctx.session.orgId, sizeCode: input.sizeCode, sizeText: input.sizeText })

                return "success"
            }

        }),
    getCategory: protectedProcedure.input(z.object({ itemId: z.string().optional() })).query(async ({ ctx, input: { itemId } }) => {
        const userPerms = ctx.session.permissions

        if (!userPerms.includes(PERMS.item_setting_view)) {
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
        if (itemId) {
            const item = (await ctx.supabase.from("Item").select("orgId").eq("id", itemId).maybeSingle()).data;
            if (!item) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Item could not found!",
                });
            }
            if (item.orgId === ctx.session.orgId) {
                return (await ctx.supabase.from("ItemCategory").select("*").eq("orgId", item.orgId)).data
            }
            const isUserAuthorised = await isAuthorised(ctx.supabase, ctx.session.orgId ?? "", item.orgId ?? "")
            if (!isUserAuthorised) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return (await ctx.supabase.from("ItemCategory").select("*").eq("orgId", item.orgId ?? "")).data

        }
        return (await ctx.supabase.from("ItemCategory").select("*").eq("orgId", ctx.session.orgId)).data

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
                await ctx.supabase.from("ItemCategory").insert({ id: createId(), orgId: ctx.session.orgId, name: input })


                return "success"
            }

        }),
    getBrands: protectedProcedure.input(z.object({ itemId: z.string().optional() })).query(async ({ ctx, input: { itemId } }) => {
        const userPerms = ctx.session.permissions

        if (!userPerms.includes(PERMS.item_setting_view)) {
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
        if (itemId) {
            const item = (await ctx.supabase.from("Item").select("orgId").eq("id", itemId).maybeSingle()).data;

            if (!item) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Item could not found!",
                });
            }
            if (item.orgId === ctx.session.orgId) {
                return (await ctx.supabase.from("ItemBrand").select("*").eq("orgId", item.orgId)).data
            }
            const isUserAuthorised = await isAuthorised(ctx.supabase, ctx.session.orgId ?? "", item.orgId ?? "")
            if (!isUserAuthorised) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return (await ctx.supabase.from("ItemBrand").select("*").eq("orgId", item.orgId ?? "")).data

        }
        return (await ctx.supabase.from("ItemBrand").select("*").eq("orgId", ctx.session.orgId)).data

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
                await ctx.supabase.from("ItemBrand").insert({ id: createId(), orgId: ctx.session.orgId, name: input })

                return "success"
            }

        }),
    addBarcode: protectedProcedure
        .input(
            z.object({
                orgId: nonEmptyString,
                itemId: nonEmptyString,
                barcode: nonEmptyString,
                unit: nonEmptyString,
                quantity: nonEmptyString,
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

            if (input.orgId !== ctx.session.orgId) {
                const isUserAuthorised = await isAuthorised(ctx.supabase, ctx.session.orgId ?? "", input.orgId ?? "")
                if (!isUserAuthorised) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
            }
            const barcode = await ctx.supabase.from("itemBarcode").select("*,Item(orgId)").eq("barcode", input.barcode)

            if (barcode.data?.filter(b => b.Item?.orgId === input.orgId).length) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Bu barkod kullanılıyor!",
                });
            }

            const { data: masterBarcode } = await ctx.supabase
                .from('itemBarcode')
                .select('*')
                .eq('isMaster', true)
                .eq('itemId', input.itemId)
                .single();

            if (input.isMaster && masterBarcode) {
                await ctx.supabase
                    .from('itemBarcode')
                    .update({ isMaster: false })
                    .eq('id', masterBarcode.id);
            }
            const { error } = await ctx.supabase.from("itemBarcode").insert({
                id: createId(),
                itemId: input.itemId,
                barcode: input.barcode,
                unit: input.unit,
                quantity: +input.quantity,
                isMaster: input.isMaster,
            })
            if (error) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Error creating item barcode: " + error.message });
            }

            return "success"
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

        const barcode = (await ctx.supabase.from("itemBarcode").select("*,Item(orgId)").eq("id", input.barcodeId).single()).data
        if (barcode?.Item?.orgId !== ctx.session.orgId) {
            const isUserAuthorised = await isAuthorised(ctx.supabase, ctx.session.orgId ?? "", barcode?.Item?.orgId ?? "")
            if (!isUserAuthorised) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
        }
        if (!barcode) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Barkod Bulunamadı!",
            });
        }
        const masterBarcode = (await ctx.supabase.from("itemBarcode").select("*,Item(orgId)").eq("isMaster", true).eq("itemId", barcode.itemId).single()).data

        if (barcode.id === masterBarcode?.id && !input.isMaster) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "En az bir adet ana barkod olmalıdır!",
            });
        }
        if (input.isMaster && masterBarcode && barcode.id !== masterBarcode.id) {
            console.log("amk hadi ya");

            const { error } = await ctx.supabase
                .from('itemBarcode')
                .update({ isMaster: false })
                .eq('id', masterBarcode.id);

            if (error) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Error updating master barcode: " + error.message });
            }

        }
        const { data: updatedBarcode, error } = await ctx.supabase
            .from('itemBarcode')
            .update({
                barcode: input.barcode,
                isMaster: input.isMaster,
                quantity: Number(input.quantity),
                unit: input.unit
            })
            .eq('id', input.barcodeId)
            .select()
            .single();

        if (error) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to update the barcode",
            });
        }

        return updatedBarcode;

    }),
    deleteBarcode: protectedProcedure.input(z.object({
        barcodeId: z.string().min(1),
    })).mutation(async ({ input: { barcodeId }, ctx }) => {
        const userPerms = ctx.session.permissions

        if (!userPerms.includes(PERMS.manage_items)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }

        const barcode = (await ctx.supabase.from("itemBarcode").select("*,Item(id,orgId)").eq("id", barcodeId).single()).data
        if (barcode?.Item?.orgId !== ctx.session.orgId) {
            const isUserAuthorised = await isAuthorised(ctx.supabase, ctx.session.orgId ?? "", barcode?.Item?.orgId ?? "")
            if (!isUserAuthorised) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
        }
        if (!barcode) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Barkod Bulunamadı!",
            });
        }

        const masterBarcode = (await ctx.supabase.from("itemBarcode").select("*,Item(id,orgId)").eq("isMaster", true).eq("itemId", barcode.itemId).single()).data

        if (barcode.id === masterBarcode?.id) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Ana barkod silinemez! Ana barkod silmek için önce başka bir ana barkod atayın!",
            });
        }
        const { error } = await ctx.supabase.from("itemBarcode").delete().eq("id", barcodeId)
        if (error) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Error deleting item barcode: " + error.message });
        }


        return "success"
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
            const { data: storage, error: storageError } = await ctx.supabase.from("Storage").select("*,ItemStock(Item(*))").eq("id", input.storageId).single()
            if (storageError) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            if (!storage) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            input.items.map(async (i) => {
                const { data: existingItemStock, error: itemStockError } = await ctx.supabase.from("ItemStock").select("*,Item(*)").eq("itemId", i.itemId).eq("storageId", input.storageId).single()
                if (itemStockError) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Depo bulunamadı!",
                    });
                }
                const { data: barcodeDetails, error: barcodeError } = await ctx.supabase.from("itemBarcode").select("*,Item(*)").eq("barcode", i.barcode).eq("itemId", i.itemId).single()
                if (barcodeError) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Barkod Bulunamadı!",
                    });
                }
                if (existingItemStock) {
                    const { error } = await ctx.supabase.from("ItemStock").update({ stock: (i.quantity * barcodeDetails.quantity) + existingItemStock.stock }).eq("id", existingItemStock.id)
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
                console.log(itemStock.data);

                const remainingStock = itemStock.data.stock - i.totalAdded
                if (remainingStock < 0) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Deponuzdaki Ürünler Yeterli Değil",
                    });
                }
                const { error } = await ctx.supabase.from("ItemStock").update({ stock: remainingStock }).eq("id", itemStock.data?.id)
                console.log(error);

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
            const { data: itemStocks, error } = await ctx.supabase.from("ItemStock").select("*").eq("storageId", input.storageId)
            if (error) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Failed to get item stocks",
                });
            }
            for (const i of itemStocks) {
                const item = input.items.find(item => item.itemId === i.itemId);
                if (item) {
                    await ctx.supabase.from("ItemStock").update({
                        stock: i.stock + item.totalAdded,
                    }).eq("id", i.id)
                }
                await ctx.supabase.from("ItemStock").delete().eq("id", i.id)
            }
            const { data: currentItemStocks, error: currentStocksError } = await ctx.supabase.from("ItemStock").select("*").eq("storageId", input.storageId)
            if (currentStocksError) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Failed to get item stocks",
                });
            }
            //filter out currentItemStocks from input.items
            const items = input.items.filter(item => !currentItemStocks.find(stock => stock.itemId === item.itemId))
            return await ctx.supabase.from("ItemStock").insert(
                items.map(i => ({ id: createId(), itemId: i.itemId, stock: i.totalAdded, storageId: input.storageId })),
            )
        }),

});
