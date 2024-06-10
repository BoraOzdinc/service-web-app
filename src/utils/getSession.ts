"use server";
import { createClient } from "./supabase/server";

export async function getSession() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser()

    const { data: userMember } = await supabase.from("Member").select("*").eq("uid", user?.id ?? "").maybeSingle()

    const { data } = await supabase.rpc('get_user_permissions', {
        user_email: userMember?.userEmail ?? ""
    });

    const userPermission = [
        ...new Set(
            data?.map(p => p.permission_name)
        ),
    ];
    return { permissions: userPermission, orgId: userMember?.orgId, dealerId: userMember?.dealerId, email: userMember?.userEmail }
}

export type SessionType = Awaited<ReturnType<typeof getSession>>