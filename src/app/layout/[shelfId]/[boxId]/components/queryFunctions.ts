import { getSession } from "~/utils/getSession"
import { createClient } from "~/utils/supabase/client"

export type BoxDetailsType = Awaited<ReturnType<typeof getBoxDetailsWithId>>
export const getBoxDetailsWithId = async (boxId: string) => {
    const session = await getSession();
    const supabase = createClient();
    if (session.orgId ?? session.dealerId) {
        return (await supabase.from("ShelfBox").select("*,ShelfItemDetail(*,Item(*))").eq("id", boxId).maybeSingle()).data
    }
    throw new Error("not org or dealer")

}