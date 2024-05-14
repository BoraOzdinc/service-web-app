import { PERMS } from "~/_constants/perms"
import { type SessionType } from "~/utils/getSession"
import { createClient } from "~/utils/supabase/client"

export type getStoragesType = Awaited<ReturnType<typeof getStorages>>
export type getStorageLayoutItemsType = Awaited<ReturnType<typeof getStorageLayoutItems>>

export const getStorages = async (session: SessionType) => {
    const supabase = createClient()
    let isLoading = true
    let storages
    if (!session.permissions.includes(PERMS.manage_storage)) {
        throw new Error("You don't have permission to do this")
    }
    if (session.orgId) {
        storages = (await supabase.from("Storage").select("*").eq("orgId", session.orgId)).data
    }
    if (session.dealerId) {
        storages = (await supabase.from("Storage").select("*").eq("dealerId", session.dealerId)).data
    }
    isLoading = false
    return { storages, isLoading }
}

export const getStorageLayoutItems = async (session: SessionType, storageId: string) => {
    const supabase = createClient()
    let shelfData
    if (!session.permissions.includes(PERMS.manage_storage)) {
        throw new Error("You don't have permission to do this")
    }
    if (!storageId) {
        throw new Error("Depo Seçilmedi!")
    }
    if (session.orgId) {
        shelfData = (await supabase.from("Shelf").select("*,ShelfItemDetail(*,Item(*)),ShelfBox(*),Storage(orgId,dealerId)").eq("storageId", storageId)).data?.filter(a => a.Storage?.orgId === session.orgId)
    }
    if (session.dealerId) {
        shelfData = (await supabase.from("Shelf").select("*,ShelfItemDetail(*,Item(*)),ShelfBox(*),Storage(orgId,dealerId)").eq("storageId", storageId)).data?.filter(a => a.Storage?.dealerId === session.dealerId)
    }
    return shelfData
}
