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

    // Check for orgId and redirect if not found
    if (!userMember?.orgId) {
        return { permissions: userPermission, orgId: userMember?.orgId, email: userMember?.userEmail, redirect: true };
    }


    return { permissions: userPermission, orgId: userMember?.orgId, email: userMember?.userEmail, redirect: false }
}

export type SessionType = Awaited<ReturnType<typeof getSession>>