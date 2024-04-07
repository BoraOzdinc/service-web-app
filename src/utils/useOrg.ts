import toast from "react-hot-toast";
import { api } from "~/trpc/server";

export const useCreateOrgMember = () => {
    const utils = api.useUtils();
    return api.organization.addMember.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Üye Oluşturuldu", { id: "org.addOrgMember" });
            await utils.organization.getOrgMembers.invalidate()
        },
        onMutate: () => {
            toast.loading("Üye Oluşturuluyor", {
                id: "org.addOrgMember",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "org.addOrgMember",
            });
        },
    });
};
export const useUpdateOrgMember = () => {
    const utils = api.useUtils();
    return api.organization.updateOrgMember.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Üye Düzenlendi", { id: "org.updateOrgMember" });
            await utils.organization.getOrgMembers.invalidate()
            await utils.organization.getOrgRoles.invalidate()
        },
        onMutate: () => {
            toast.loading("Üye Düzenleniyor", {
                id: "org.updateOrgMember",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "org.updateOrgMember",
            });
        },
    });
};
export const useUpdateRole = () => {
    const utils = api.useUtils();
    return api.organization.updateRole.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Rol Düzenlendi", { id: "org.updateRole" });
            await utils.organization.getOrgRoles.invalidate()
            await utils.organization.getOrgPerms.invalidate()
        },
        onMutate: () => {
            toast.loading("Rol Düzenleniyor", {
                id: "org.updateRole",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "org.updateRole",
            });
        },
    });
};
export const useDeleteOrgRole = () => {
    const utils = api.useUtils();
    return api.organization.deleteOrgRole.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Rol Silindi", { id: "org.deleteOrgRole" });
            await utils.organization.getOrgRoles.invalidate()
            await utils.organization.getOrgPerms.invalidate()
            await utils.organization.getOrgMembers.invalidate()
        },
        onMutate: () => {
            toast.loading("Rol Siliniyor", {
                id: "org.deleteOrgRole",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "org.deleteOrgRole",
            });
        },
    });
};
export const useDeleteOrgMember = () => {
    const utils = api.useUtils();
    return api.organization.deleteOrgMember.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Üye Silindi", { id: "org.deleteOrgMember" });
            await utils.organization.getOrgRoles.invalidate()
            await utils.organization.getOrgMembers.invalidate()
        },
        onMutate: () => {
            toast.loading("Üye Siliniyor", {
                id: "org.deleteOrgMember",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "org.deleteOrgMember",
            });
        },
    });
};
export const useCreateOrgRole = () => {
    const utils = api.useUtils();
    return api.organization.createOrgRole.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Rol Eklendi", { id: "org.createDealerRole" });
            await utils.organization.getOrgRoles.invalidate()
            await utils.organization.getOrgPerms.invalidate()
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