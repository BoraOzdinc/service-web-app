
import toast from "react-hot-toast";
import { api } from "~/trpc/server";
import { type RouterOutputs } from "~/trpc/shared";




export type Item = RouterOutputs["items"]["getItems"][number]

export type ItemWithId = RouterOutputs["items"]["getItemWithId"]

export type Storage = RouterOutputs["items"]["getStorages"][number]

export type ItemHistory = RouterOutputs["items"]["getItemWithId"]["ItemHistory"][number]


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
export const useUpdateItem = () => {
    const utils = api.useUtils();
    return api.items.updateItem.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Ürün Güncellendi", { id: "item.updateItem" });
            await utils.items.getItems.invalidate()
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


