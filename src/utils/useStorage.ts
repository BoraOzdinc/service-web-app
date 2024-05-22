import toast from "react-hot-toast";
import { api } from "~/trpc/server";



export const useCreateShelf = () => {
    const utils = api.useUtils()
    return api.storage.addShelf.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Raf Oluşturuldu", { id: "org.addShelf" });
            await utils.storage.getStorageLayoutItems.invalidate()
        },
        onMutate: () => {
            toast.loading("Raf Oluşturuluyor...", {
                id: "org.addShelf",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "org.addShelf",
            });
        },
    });
};
export const useCreateShelfBox = () => {
    const utils = api.useUtils()
    return api.storage.addBox.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Kutu Oluşturuldu", { id: "org.addBox" });
            await utils.storage.getShelfDetailsWithId.invalidate()
        },
        onMutate: () => {
            toast.loading("Kutu Oluşturuluyor...", {
                id: "org.addBox",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "org.addBox",
            });
        },
    });
};
export const useDeleteShelf = () => {
    const utils = api.useUtils()
    return api.storage.deleteShelf.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Raf Silindi", { id: "org.deleteShelf" });
            await utils.storage.getStorageLayoutItems.invalidate()
        },
        onMutate: () => {
            toast.loading("Raf Siliniyor...", {
                id: "org.deleteShelf",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "org.deleteShelf",
            });
        },
    });
};