import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { nonEmptyString } from "./items";
import { TRPCError } from "@trpc/server";
import cuid2 from "@paralleldrive/cuid2";



export const serviceRouter = createTRPCRouter({
    addImageToItem: protectedProcedure.input(z.object({
        itemId: nonEmptyString, image: nonEmptyString
    })).mutation(async ({ ctx, input }) => {

        if (!input.image) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid Payload",
            });
        }
        const { data: item, error } = await ctx.supabase.from("Item").select("*").eq("id", input.itemId).single()
        if (error) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to get item:" + error.message,
            })
        }
        if (item.isServiceItem) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Bu ürün servis ürünüdür!"
            })
        }
        const { data: itemImage, error: imageError } = await ctx.supabase.storage.from("images").upload(`private/${item.orgId}/${cuid2.createId()}`, input.image)
        if (imageError) {

            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to upload image:" + imageError.message,
            })
        }

        const { data: updateItem, error: updateItemError } = await ctx.supabase.from("Item").update({ image: itemImage.path }).eq("id", input.itemId).select().single()

        if (updateItemError) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to update item:" + updateItemError.message,
            })
        }
        return updateItem.image
    })
})