"use server";

import { db } from "~/server/db";
import { createClient } from "./supabase/server";

export async function getSession() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser()
    const userMember = await db.member.findUnique({
        where: { userEmail: user?.email },
        include: { roles: { include: { permissions: true } } },
    });
    const userPermission = [
        ...new Set(
            userMember?.roles.flatMap((r) => r.permissions.map((p) => p.name)),
        ),
    ];
    return { permissions: userPermission, orgId: userMember?.orgId, dealerId: userMember?.dealerId, email: userMember?.userEmail }
}
