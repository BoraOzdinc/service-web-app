import toast from "react-hot-toast";
import { api } from "~/trpc/server";

export const useCreateOrg = () => {
    const utils = api.useUtils();
    return api.orgs.createOrg.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Organizasyon Oluşturuldu", { id: "org.addOrg" });
            await utils.invalidate()
        },
        onMutate: () => {
            toast.loading("Organizasyon Oluşturuluyor", {
                id: "org.addOrg",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "org.addOrg",
            });
        },
    });
};