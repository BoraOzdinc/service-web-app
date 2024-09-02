import { z } from "zod";
import { type SupabaseClient } from "./supabase/client";


export function extractData(str: string) {
    const startIndex = str.indexOf("[{");
    const endIndex = str.lastIndexOf("}]") + 2;
    const jsonStr = str.substring(startIndex, endIndex);
    return jsonStr;
}

export const isValidEmail = (email: string | undefined) => {
    try {
        z.string().email().parse(email);
        return false;
    } catch (error) {
        return true;
    }
};

export const memberFinder: (session: {
    permissions: string[];
    orgId: string | null | undefined;
    dealerId: string | null | undefined;
    email: string | undefined;
    id: string | undefined;
}) => "org" | "dealer" | "none" = (session) => {
    if (session.orgId) {
        return "org"
    }
    if (session.dealerId) {
        return "dealer"
    }
    return "none"
}

export const isAuthorised = async (supabase: SupabaseClient, sessionOrgId: string, dealerId: string) => {
    return Boolean((await supabase.from("Org").select("dealerRelations:DealerRelation!DealerRelation_parentOrgId_fkey(*)").eq("id", sessionOrgId)).data?.find(a => a.dealerRelations.find(b => b.dealerId === dealerId)))
}
