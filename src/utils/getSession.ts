"use server";
import { createClient } from "./supabase/server";

export async function getSession() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser()
    const userMember = (await supabase.from("Member").select("orgId,dealerId,userEmail").eq("userEmail", user?.email ?? "").maybeSingle()).data
    const { data } = await supabase.rpc('get_user_permissions', {
        inputemail: userMember?.userEmail ?? "",
    });

    const userPermission = [
        ...new Set(
            data?.map(p => p.permission_name)
        ),
    ];
    return { permissions: userPermission, orgId: userMember?.orgId, dealerId: userMember?.dealerId, email: userMember?.userEmail }
}

export type SessionType = Awaited<ReturnType<typeof getSession>>