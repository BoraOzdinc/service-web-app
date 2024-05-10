import { PERMS } from "~/_constants/perms";
import { type SessionType } from "~/utils/getSession";
import { createClient } from "~/utils/supabase/client";

export type getColorsType = Awaited<ReturnType<typeof getColors>>
export type getCategoriesType = Awaited<ReturnType<typeof getCategories>>
export type getSizesType = Awaited<ReturnType<typeof getSizes>>
export type getBrandsType = Awaited<ReturnType<typeof getBrands>>
export const getColors = async (session: SessionType) => {
    let isLoading = true
    const supabase = createClient()
    let data
    if (!session.permissions.includes(PERMS.item_setting_view)) {
        throw new Error("You don't have permission to do this!");
    }
    if (session.orgId) {

        data = (await supabase.from("ItemColor").select("*").eq("orgId", session.orgId)).data

    }
    if (session.dealerId) {
        data = (await supabase.from("ItemColor").select("*").eq("dealerId", session.dealerId)).data
    }
    isLoading = false
    return { data, isLoading }
}
export const getCategories = async (session: SessionType) => {
    let isLoading = true
    const supabase = createClient()
    let data
    if (!session.permissions.includes(PERMS.item_setting_view)) {
        throw new Error("You don't have permission to do this!");
    }
    if (session.orgId) {

        data = (await supabase.from("ItemCategory").select("*").eq("orgId", session.orgId)).data

    }
    if (session.dealerId) {
        data = (await supabase.from("ItemCategory").select("*").eq("dealerId", session.dealerId)).data
    }
    isLoading = false
    return { data, isLoading }
}
export const getSizes = async (session: SessionType) => {
    let isLoading = true
    const supabase = createClient()
    let data
    if (!session.permissions.includes(PERMS.item_setting_view)) {
        throw new Error("You don't have permission to do this!");
    }
    if (session.orgId) {

        data = (await supabase.from("ItemSize").select("*").eq("orgId", session.orgId)).data

    }
    if (session.dealerId) {
        data = (await supabase.from("ItemSize").select("*").eq("dealerId", session.dealerId)).data
    }
    isLoading = false
    return { data, isLoading }
}
export const getBrands = async (session: SessionType) => {
    let isLoading = true
    const supabase = createClient()
    let data
    if (!session.permissions.includes(PERMS.item_setting_view)) {
        throw new Error("You don't have permission to do this!");
    }
    if (session.orgId) {

        data = (await supabase.from("ItemBrand").select("*").eq("orgId", session.orgId)).data

    }
    if (session.dealerId) {
        data = (await supabase.from("ItemBrand").select("*").eq("dealerId", session.dealerId)).data
    }
    isLoading = false
    return { data, isLoading }
}