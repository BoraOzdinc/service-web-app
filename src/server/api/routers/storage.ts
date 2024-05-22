import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PERMS } from "~/_constants/perms";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { nonEmptyString } from "./items";
import QRCode from "qrcode";
import { getBaseUrl } from "~/trpc/server";

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
            const storage = (
                await ctx.supabase
                    .from("Storage")
                    .select("orgId,dealerId")
                    .eq("id", input.storageId)
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
            if (storage.dealerId !== ctx.session.dealerId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Bu Depo Size Ait Değil!",
                });
            }
            return await ctx.db.shelf.create({
                data: { storageId: input.storageId, name: input.name },
            });
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
            return await ctx.db.shelf.delete({ where: { id: shelfId } });
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
            if (ctx.session.orgId) {
                return (
                    await ctx.supabase
                        .from("Shelf")
                        .select(
                            "*,ShelfItemDetail(*,Item(*)),ShelfBox(*),Storage(orgId,dealerId)",
                        )
                        .eq("storageId", storageId)
                ).data?.filter((a) => a.Storage?.orgId === ctx.session.orgId);
            }
            if (ctx.session.dealerId) {
                return (
                    await ctx.supabase
                        .from("Shelf")
                        .select(
                            "*,ShelfItemDetail(*,Item(*)),ShelfBox(*),Storage(orgId,dealerId)",
                        )
                        .eq("storageId", storageId)
                ).data?.filter((a) => a.Storage?.dealerId === ctx.session.dealerId);
            }
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
            if (session.orgId) {
                const data = (
                    await supabase
                        .from("Shelf")
                        .select(
                            "*,ShelfItemDetail(*,Item(*)),ShelfBox(*,ShelfItemDetail(*)),Storage(id,orgId,dealerId)",
                        )
                        .eq("id", shelfId)
                        .maybeSingle()
                ).data;
                if (data?.Storage?.orgId === session.orgId) {
                    return data;
                }
            }
            if (session.dealerId) {
                const data = (
                    await supabase
                        .from("Shelf")
                        .select(
                            "*,ShelfItemDetail(*,Item(*)),ShelfBox(*,ShelfItemDetail(*)),Storage(id,orgId,dealerId)",
                        )
                        .eq("id", shelfId)
                        .maybeSingle()
                ).data;
                if (data?.Storage?.dealerId === session.dealerId) {
                    return data;
                }
            }
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
            return await ctx.db.shelfBox.create({
                data: { name, shelfId, storageId },
            });
        }),
    generateQrCodes: protectedProcedure
        .input(z.object({ storageId: nonEmptyString }))
        .mutation(async ({ ctx, input: { storageId } }) => {
            const storage = (
                await ctx.supabase
                    .from("Storage")
                    .select(
                        "orgId,dealerId,Shelf(*,ShelfItemDetail(*,Item(*)),ShelfBox(*))",
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
            if (storage.dealerId !== ctx.session.dealerId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Bu Depo Size Ait Değil!",
                });
            }
            const qrlinks = await Promise.all(
                storage.Shelf.map(async (shelf) => {
                    const qrlink = await generateQR(
                        `${getBaseUrl()}/layout/${shelf.id}`,
                    );
                    return {
                        qrLink: qrlink,
                        name: shelf.name,
                        boxes: await Promise.all(
                            shelf.ShelfBox.map(async (box) => {
                                const qrlink = await generateQR(
                                    `${getBaseUrl()}/layout/${shelf.id}/${box.id}`,
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
