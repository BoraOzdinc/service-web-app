
import toast from "react-hot-toast";
import { api } from "~/trpc/server";
import { type RouterOutputs } from "~/trpc/shared";




export type Item = RouterOutputs["items"]["getItems"][number]

export type ItemWithId = RouterOutputs["items"]["getItemWithId"]

export type Storage = RouterOutputs["items"]["getStorages"][number]

export type ItemHistory = RouterOutputs["items"]["getItemWithId"]["ItemHistory"][number]

export type ItemAcceptHistory = RouterOutputs["items"]["getItemAcceptHistory"][number]


export const useAddItem = () => {
    const utils = api.useUtils();
    return api.items.addItem.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Ürün Eklendi", { id: "item.addItem" });
            await utils.items.getItems.invalidate()
            await utils.items.getItemWithId.invalidate()
        },
        onMutate: () => {
            toast.loading("Ürün Ekleniyor", {
                id: "item.addItem",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.addItem",
            });
        },
    });
};
export const useAddColor = () => {
    const utils = api.useUtils();
    return api.items.addColor.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Renk Eklendi", { id: "item.addColor" });
            await utils.items.getColors.invalidate()
        },
        onMutate: () => {
            toast.loading("Renk Ekleniyor", {
                id: "item.addColor",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.addColor",
            });
        },
    });
};
export const useAddBarcode = () => {
    const utils = api.useUtils();
    return api.items.addBarcode.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Barkod Eklendi", { id: "item.addBarcode" });
            await utils.items.getItemWithId.invalidate()
        },
        onMutate: () => {
            toast.loading("Barkod Ekleniyor", {
                id: "item.addBarcode",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.addBarcode",
            });
        },
    });
};
export const useUpdateBarcode = () => {
    const utils = api.useUtils();
    return api.items.updateBarcode.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Barkod Düzenlendi", { id: "item.updateBarcode" });
            await utils.items.getItemWithId.invalidate()
        },
        onMutate: () => {
            toast.loading("Barkod Düzenleniyor", {
                id: "item.updateBarcode",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.updateBarcode",
            });
        },
    });
};
export const useAddSize = () => {
    const utils = api.useUtils();
    return api.items.addSize.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Beden Eklendi", { id: "item.addSize" });
            await utils.items.getSizes.invalidate()
        },
        onMutate: () => {
            toast.loading("Beden Ekleniyor", {
                id: "item.addSize",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.addSize",
            });
        },
    });
};
export const useAddCategory = () => {
    const utils = api.useUtils();
    return api.items.addCategory.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Kategori Eklendi", { id: "item.addCategory" });
            await utils.items.getCategory.invalidate()
        },
        onMutate: () => {
            toast.loading("Kategori Ekleniyor", {
                id: "item.addCategory",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.addCategory",
            });
        },
    });
};
export const useAddBrand = () => {
    const utils = api.useUtils();
    return api.items.addBrands.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Marka Eklendi", { id: "item.addBrand" });
            await utils.items.getBrands.invalidate()
        },
        onMutate: () => {
            toast.loading("Marka Ekleniyor", {
                id: "item.addBrand",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.addBrand",
            });
        },
    });
};
export const useUpdateItem = () => {
    const utils = api.useUtils();
    return api.items.updateItem.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Ürün Güncellendi", { id: "item.updateItem" });
            await utils.items.getItemWithId.invalidate()
        },
        onMutate: () => {
            toast.loading("Ürün Güncelleniyor", {
                id: "item.updateItem",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.updateItem",
            });
        },
    });
};
export const useAddStorage = () => {
    const utils = api.useUtils();
    return api.items.addStorage.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Depo Eklendi", { id: "item.getStorage" });
            await utils.items.getStorages.invalidate()
            await utils.items.getItems.invalidate()
        },
        onMutate: () => {
            toast.loading("Depo Ekleniyor", {
                id: "item.getStorage",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.getStorage",
            });
        },
    });
};
export const useDeleteStorage = () => {
    const utils = api.useUtils();
    return api.items.deleteStorage.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Depo Silindi", { id: "item.deleteStorage" });
            await utils.items.getStorages.invalidate()
        },
        onMutate: () => {
            toast.loading("Depo Siliniyor", {
                id: "item.deleteStorage",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.deleteStorage",
            });
        },
    });
};
export const useItemAccept = () => {
    const utils = api.useUtils();
    return api.items.itemAccept.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Ürünler Kabul Edildi!", { id: "item.itemAccept" });
            await utils.items.getItemAcceptHistory.invalidate();
        },
        onMutate: () => {
            toast.loading("Kabul Ediliyor...", {
                id: "item.itemAccept",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.itemAccept",
            });
        },
    });
};


