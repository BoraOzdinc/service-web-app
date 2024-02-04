import { redirect } from "next/navigation";
import { Router } from "next/router";
import toast from "react-hot-toast";
import { api } from "~/trpc/server";
import { type RouterOutputs } from "~/trpc/shared";




export type Item = RouterOutputs["items"]["getItems"][number]

export type Storage = RouterOutputs["items"]["getStorages"][number]



export const useAddItem = () => {
    const utils = api.useUtils();
    return api.items.addItem.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Ürün Eklendi", { id: "item.addItem" });
            await utils.items.getItems.invalidate()
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