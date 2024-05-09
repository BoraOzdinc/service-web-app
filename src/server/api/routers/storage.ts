import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PERMS } from "~/_constants/perms";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { nonEmptyString } from "./items";

export const StorageRouter = createTRPCRouter({
    getStorages: protectedProcedure.query(async ({ ctx }) => {
        if (!ctx.session.permissions.includes(PERMS.manage_storage)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this"
            })
        }
        return await ctx.db.storage.findMany({
            where: {
                orgId: ctx.session.orgId,
                dealerId: ctx.session.dealerId
            }
        })
    }),
    getStorageLayoutItems: protectedProcedure.input(z.object({ storageId: z.string() })).query(async ({ input: { storageId }, ctx }) => {
        if (!ctx.session.permissions.includes(PERMS.manage_storage)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this"
            })
        }
        if (!storageId) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Depo Seçilmedi!" })
        }
        return await ctx.db.shelf.findMany({ where: { storageId }, include: { items: true, boxes: true } })
    }),
    getShelfDetailsWithId: protectedProcedure.input(z.object({ shelfId: nonEmptyString })).query(async ({ ctx, input: { shelfId } }) => {

        if (!ctx.session.permissions.includes(PERMS.manage_storage)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this"
            })
        }
        if (!shelfId) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Depo Seçilmedi!" })
        }
        return await ctx.db.shelf.findUnique({ where: { id: shelfId }, include: { items: { include: { item: true } }, boxes: { include: { items: { include: { item: true } } } } } })
    }),
    getBoxDetailsWithId: protectedProcedure.input(z.object({ boxId: nonEmptyString })).query(async ({ ctx, input: { boxId } }) => {

        if (!ctx.session.permissions.includes(PERMS.manage_storage)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this"
            })
        }
        if (!boxId) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Depo Seçilmedi!" })
        }
        const boxDetails = await ctx.db.shelfBox.findUnique({ where: { id: boxId }, include: { items: { include: { item: true } } } })
        if (!boxDetails) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Kayıtlı kutu bulunamadı." })
        }
        return boxDetails
    })
})