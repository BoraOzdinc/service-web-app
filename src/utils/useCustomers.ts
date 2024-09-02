import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "~/trpc/server";
import { type RouterOutputs } from "~/trpc/shared";

export type getCustomerType = RouterOutputs["customer"]["getCustomers"][number]

export type customerById = RouterOutputs["customer"]["getCustomerWithId"]

export type customerTransaction = RouterOutputs["customer"]["getCustomerTransactions"][number]

export const useCreateCustomer = () => {
    const router = useRouter()
    return api.customer.addCustomer.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Müşteri Oluşturuldu", { id: "customer.addCustomer" });
            router.push(`/customers/${_d.id}`)
        },
        onMutate: () => {
            toast.loading("Müşteri Oluşturuluyor", {
                id: "customer.addCustomer",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "customer.addCustomer",
            });
        },
    });
};
export const usePayDebt = () => {
    const utils = api.useUtils()

    return api.customer.payUpDebt.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Borç Ödendi", { id: "customer.payDebt" });
            await utils.customer.getCustomerTransactions.invalidate()
        },
        onMutate: () => {
            toast.loading("Borç Ödeniyor...", {
                id: "customer.payDebt",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "customer.payDebt",
            });
        },
    });
};
export const useUpdateCustomer = () => {
    const utils = api.useUtils()

    return api.customer.updateCustomer.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Müşteri Düzenlendi", { id: "customer.updateCustomer" });
            await utils.customer.getCustomerWithId.invalidate()
        },
        onMutate: () => {
            toast.loading("Müşteri Düzenleniyor", {
                id: "customer.updateCustomer",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "customer.updateCustomer",
            });
        },
    });
};
export const useAddAddress = () => {
    const utils = api.useUtils()
    return api.customer.addAddress.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Adres Eklendi", { id: "customer.addAddress" });
            await utils.customer.getCustomerWithId.invalidate()
        },
        onMutate: () => {
            toast.loading("Adres Ekleniyor", {
                id: "customer.addAddress",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "customer.addAddress",
            });
        },
    });
};
export const useUpdateAddress = () => {
    const utils = api.useUtils()
    return api.customer.updateAddress.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Adres Düzenlendi", { id: "customer.updateAddress" });
            await utils.customer.getCustomerWithId.invalidate()
        },
        onMutate: () => {
            toast.loading("Adres Düzenleniyor", {
                id: "customer.updateAddress",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "customer.updateAddress",
            });
        },
    });
};
export const useDeleteAddress = () => {
    const utils = api.useUtils()
    return api.customer.deleteAddress.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Adres Silindi", { id: "customer.deleteAddress" });
            await utils.customer.getCustomerWithId.invalidate()
        },
        onMutate: () => {
            toast.loading("Adres Siliniyor", {
                id: "customer.deleteAddress",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "customer.deleteAddress",
            });
        },
    });
};