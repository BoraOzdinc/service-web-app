import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PERMS } from "~/_constants/perms";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { nonEmptyString } from "./items";
import QRCode from "qrcode";
import { createId } from "@paralleldrive/cuid2";

export const StorageRouter = createTRPCRouter({
    addShelf: protectedProcedure
        .input(z.object({ storageId: nonEmptyString, name: nonEmptyString }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session.permissions.includes(PERMS.manage_layout)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You Don't Have Permission To Do This!",
                });
            }
            const { data: storage, error: storageError } = (
                await ctx.supabase
                    .from("Storage")
                    .select("orgId")
                    .eq("id", input.storageId)
                    .single()
            )

            if (storageError) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Depo Bulunamadı!" });
            }
            if (storage.orgId !== ctx.session.orgId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Bu Depo Size Ait Değil!",
                });
            }

            const { data: shelf, error } = await ctx.supabase.from("Shelf").insert({
                id: createId(),
                storageId: input.storageId,
                name: input.name,
                updateDate: new Date().toUTCString(),
            })
            if (error) {
                throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
            }
            return shelf;
        }),
    deleteShelf: protectedProcedure
        .input(z.object({ shelfId: nonEmptyString }))
        .mutation(async ({ ctx, input: { shelfId } }) => {
            if (!ctx.session.permissions.includes(PERMS.manage_layout)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You Don't Have Permission To Do This!",
                });
            }
            const { data: shelf, error } = await ctx.supabase.from("Shelf").select("*,storage:Storage(*)").eq("id", shelfId).single()
            if (error) {
                throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
            }
            if (shelf.storage?.orgId !== ctx.session.orgId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Bu Depo Size Ait Değil!",
                });
            }
            const { error: deleteShelfError } = await ctx.supabase.from("Shelf").delete().eq("id", shelfId)
            if (deleteShelfError) {
                throw new TRPCError({ code: "BAD_REQUEST", message: deleteShelfError.message });
            }
            return shelf;
        }),
    getStorageLayoutItems: protectedProcedure
        .input(z.object({ storageId: nonEmptyString }))
        .query(async ({ ctx, input: { storageId } }) => {
            if (!ctx.session.permissions.includes(PERMS.manage_storage)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this",
                });
            }
            if (!storageId) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Depo Seçilmedi!",
                });
            }
            if (!ctx.session.orgId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this",
                });
            }
            const { data: shelf, error } = await ctx.supabase.from("Shelf").select("*,ShelfItemDetail(*,Item(*)),ShelfBox(*),Storage(orgId)").eq("storageId", storageId)
            if (error) {
                throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
            }
            return shelf.filter((a) => a.Storage?.orgId === ctx.session.orgId)
        }),
    getShelfDetailsWithId: protectedProcedure
        .input(z.object({ shelfId: nonEmptyString }))
        .query(async ({ ctx, input: { shelfId } }) => {
            const supabase = ctx.supabase;
            const session = ctx.session;
            if (!session.permissions.includes(PERMS.manage_storage)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this",
                });
            }
            if (!shelfId) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Depo Seçilmedi!",
                });
            }
            if (!ctx.session.orgId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this",
                });
            }
            const { data, error } = await supabase
                .from("Shelf")
                .select(
                    "*,ShelfItemDetail(*,Item(*)),ShelfBox(*,ShelfItemDetail(*)),Storage(id,orgId)",
                )
                .eq("id", shelfId)
                .maybeSingle()

            if (error) {
                throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
            }
            if (data?.Storage?.orgId !== session.orgId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Bu Depo Size Ait Değil!",
                });
            }
            return data;
        }),
    addBox: protectedProcedure
        .input(
            z.object({
                shelfId: nonEmptyString,
                storageId: nonEmptyString,
                name: nonEmptyString,
            }),
        )
        .mutation(async ({ ctx, input: { name, shelfId, storageId } }) => {
            if (!ctx.session.permissions.includes(PERMS.manage_storage)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this",
                });
            }
            if (!shelfId) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Raf Seçilmedi!" });
            }
            const { data, error } = await ctx.supabase.from("ShelfBox").insert({
                id: createId(),
                shelfId,
                storageId,
                name,
                updateDate: new Date().toUTCString(),
            })
            if (error) {
                throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
            }
            return data;
        }),
    generateQrCodes: protectedProcedure
        .input(z.object({ storageId: nonEmptyString, }))
        .mutation(async ({ ctx, input: { storageId } }) => {
            const storage = (
                await ctx.supabase
                    .from("Storage")
                    .select(
                        "orgId,Shelf(*,ShelfItemDetail(*,Item(*)),ShelfBox(*))",
                    )
                    .eq("id", storageId)
                    .maybeSingle()
            ).data;
            if (!storage) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Depo Bulunamadı!" });
            }
            if (storage.orgId !== ctx.session.orgId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Bu Depo Size Ait Değil!",
                });
            }

            const mainLink = () => {
                if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`; // SSR should use vercel url
                return `http://localhost:${process.env.PORT ?? 3000}`
            }
            const qrlinks = await Promise.all(
                storage.Shelf.map(async (shelf) => {
                    const qrlink = await generateQR(
                        `${mainLink()}/layout/${shelf.id}`,
                    );
                    return {
                        qrLink: qrlink,
                        name: shelf.name,
                        boxes: await Promise.all(
                            shelf.ShelfBox.map(async (box) => {
                                const qrlink = await generateQR(
                                    `${mainLink()}/layout/${shelf.id}/${box.id}`,
                                );
                                return { qrLink: qrlink, name: box.name };
                            }),
                        ),
                    };
                }),
            );
            return qrlinks;
        }),
});

const generateQR = async (text: string) => {
    return await QRCode.toDataURL(text);
};
