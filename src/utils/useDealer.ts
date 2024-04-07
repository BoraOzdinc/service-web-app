import toast from "react-hot-toast";
import { api } from "~/trpc/server";

export const useCreateDealerMember = () => {
    const utils = api.useUtils();
    return api.organization.addMember.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Üye Oluşturuldu", { id: "org.addDealerMember" });
            await utils.dealer.getDealerMembers.invalidate()
        },
        onMutate: () => {
            toast.loading("Üye Oluşturuluyor", {
                id: "org.addDealerMember",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "org.addDealerMember",
            });
        },
    });
};

export const useDeleteDealerRole = () => {
    const utils = api.useUtils();
    return api.dealer.deleteDealerRole.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Rol Silindi", { id: "org.deleteDealerRole" });
            await utils.dealer.getDealerRoles.invalidate()
            await utils.dealer.getDealerPerms.invalidate()
            await utils.dealer.getDealerMembers.invalidate()
        },
        onMutate: () => {
            toast.loading("Rol Siliniyor", {
                id: "org.deleteDealerRole",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "org.deleteDealerRole",
            });
        },
    });
};
export const useDeleteDealerMember = () => {
    const utils = api.useUtils();
    return api.dealer.deleteDealerMember.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Üye Silindi", { id: "org.deleteDealerMember" });
            await utils.dealer.getDealerRoles.invalidate()
            await utils.dealer.getDealerMembers.invalidate()
        },
        onMutate: () => {
            toast.loading("Üye Siliniyor", {
                id: "org.deleteDealerMember",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "org.deleteDealerMember",
            });
        },
    });
};
export const useCreateDealerRole = () => {
    const utils = api.useUtils();
    return api.dealer.createDealerRole.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Rol Eklendi", { id: "org.createDealerRole" });
            await utils.dealer.getDealerRoles.invalidate()
            await utils.dealer.getDealerPerms.invalidate()
        },
        onMutate: () => {
            toast.loading("Rol Ekleniyor...", {
                id: "org.createDealerRole",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "org.createDealerRole",
            });
        },
    });
};
export const useUpdateDealerMember = () => {
    const utils = api.useUtils();
    return api.dealer.updateDealerMember.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Üye Düzenlendi", { id: "org.updateDealerMember" });
            await utils.dealer.getDealerMembers.invalidate()
            await utils.dealer.getDealerRoles.invalidate()
        },
        onMutate: () => {
            toast.loading("Üye Düzenleniyor", {
                id: "org.updateDealerMember",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "org.updateDealerMember",
            });
        },
    });
};
