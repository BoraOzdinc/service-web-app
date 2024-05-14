import { PERMS } from "~/_constants/perms"
import { getSession } from "~/utils/getSession"
import { createClient } from "~/utils/supabase/client"




export const getShelfDetailsWithId = async (shelfId: string) => {
    const supabase = createClient()
    const session = await getSession()
    let shelfData
    if (!session.permissions.includes(PERMS.manage_storage)) {
        throw new Error("You don't have permission to do this")
    }
    if (!shelfId) {
        throw new Error("Depo Seçilmedi!")
    }
    if (session.orgId) {
        const data = (await supabase.from("Shelf").select("*,ShelfItemDetail(*,Item(*)),ShelfBox(*,ShelfItemDetail(*)),Storage(orgId,dealerId)").eq("id", shelfId).maybeSingle()).data
        if (data?.Storage?.orgId === session.orgId) {
            shelfData = data
        }
    }
    if (session.dealerId) {
        const data = (await supabase.from("Shelf").select("*,ShelfItemDetail(*,Item(*)),ShelfBox(*,ShelfItemDetail(*)),Storage(orgId,dealerId)").eq("id", shelfId).maybeSingle()).data
        if (data?.Storage?.dealerId === session.dealerId) {
            shelfData = data
        }
    }
    return shelfData
}