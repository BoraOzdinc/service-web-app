import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PERMS } from "../../../_constants/perms";
import { TRPCError } from "@trpc/server";
import { nonEmptyString } from "./items";

export const organizationRouter = createTRPCRouter({

    getOrgById: protectedProcedure
        .input(z.object({ orgId: nonEmptyString }))
        .query(async ({ ctx, input }) => {
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid Payload",
                });
            }
            if (!ctx.session.user.permissions.includes(PERMS.view_org_members) || !ctx.session.user.orgId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            if (input.orgId !== ctx.session.user.orgId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.org.findUnique({ where: { id: input.orgId } })
        }),
    getOrgRoles: protectedProcedure.input(z.object({ orgId: nonEmptyString })).query(async ({ ctx, input }) => {
        if (!input) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid Payload!" })
        }
        const userPerms = ctx.session.user.permissions
        if (!userPerms.includes(PERMS.view_org_role)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        return await ctx.db.memberRole.findMany({
            where: { orgId: input.orgId },
            include: { permissions: true, OrgMembers: { include: { user: true } } }
        })
    }),
    updateOrgMember: protectedProcedure
        .input(z.object({ roleIds: z.string().array(), orgMemberId: nonEmptyString }))
        .mutation(async ({ ctx, input }) => {
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid Payload",
                });
            }
            const userPerms = ctx.session.user.permissions
            if (!userPerms.includes(PERMS.manage_org_members)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            const Org = await ctx.db.org.findFirst({
                where: {
                    OR: [
                        { id: ctx.session.user.orgId },
                        { dealers: { some: { id: ctx.session.user.dealerId } } }]
                },
                include: { dealers: { include: { members: true } } }
            })
            if (!Org) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.orgMember.update({
                where: { id: input.orgMemberId },
                data: { roles: { set: input.roleIds.map(r => ({ id: r })) } },

            })
        }),
    deleteOrgMember: protectedProcedure.input(z.object({ memberId: nonEmptyString }))
        .mutation(async ({ ctx, input }) => {
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid Payload",
                });
            }
            const member = await ctx.db.orgMember.findUnique({ where: { userId: ctx.session.user.id } })
            if (member?.id === input.memberId) {

                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Kendi hesabını silemezsin!",
                });

            }
            const userPerms = ctx.session.user.permissions
            if (!userPerms.includes(PERMS.manage_org_members)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.orgMember.delete({ where: { id: input.memberId } })
        }),
    getOrgMembers: protectedProcedure.input(z.object({ orgId: nonEmptyString })).query(async ({ ctx, input }) => {
        if (!input) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid Payload!" })
        }
        const userPerms = ctx.session.user.permissions
        if (!userPerms.includes(PERMS.view_org_members)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        if (input.orgId !== ctx.session.user.orgId) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        return await ctx.db.orgMember.findMany({
            where: { orgId: input.orgId },
            include: { user: true, roles: true }
        })
    }),
    addMember: protectedProcedure.input(z.object({ orgId: z.string().optional(), dealerId: z.string().optional(), email: nonEmptyString }))
        .mutation(async ({ ctx, input }) => {
            if (!input.dealerId && !input.orgId) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid Payload",
                });
            }
            const userPermission = ctx.session.user.permissions
            const invitedUser = await ctx.db.user.findUnique({ where: { email: input.email } })
            if (!invitedUser) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "bu e-mail adresi ile kayıtlı üye bulunamadı!",
                });
            }

            if (input.orgId) {
                if (!userPermission.includes(PERMS.manage_org_members)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                try {
                    return await ctx.db.orgMember.create({ data: { orgId: input.orgId, userId: invitedUser.id } })
                } catch {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Bu Kullanıcı zaten bir Organizasyon Üyesi!",
                    });
                }
            }
            if (input.dealerId) {
                if (!userPermission.includes(PERMS.manage_dealer_members)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                try {
                    return await ctx.db.dealerMember.create({ data: { dealerId: input.dealerId, userId: invitedUser.id } })
                } catch {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Bu Kullanıcı zaten bir Bayii Üyesi!",
                    });
                }
            }

            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Neither org member or dealer member",
            });
        }),

    createDealer: protectedProcedure.input(nonEmptyString).mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;
        if (!input) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid Payload",
            });
        }
        const orgMember = await ctx.db.orgMember.findUnique({
            where: { userId: userId },
            include: {
                roles: { include: { permissions: true } },
            },
        });
        if (orgMember) {
            const orgMemberPermissions = orgMember.roles.flatMap((role) =>
                role.permissions.map((p) => p.name),
            );


            if (!orgMemberPermissions.includes(PERMS.create_dealer)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.dealer.create({ data: { name: input, orgId: orgMember.orgId } })

        }
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You don't have permission to do this!",
        });
    }),
    getOrgPerms: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.memberPermission.findMany({ where: { assignableTo: { has: "Organization" } } })
    }),
    updateRole: protectedProcedure
        .input(z.object({ roleId: nonEmptyString, permIds: z.string().array(), roleName: nonEmptyString }))
        .mutation(async ({ ctx, input }) => {
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid Payload",
                });
            }
            const userPerms = ctx.session.user.permissions
            if (!userPerms.includes(PERMS.manage_dealer_role || PERMS.manage_org_role)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.memberRole.update({
                where: { id: input.roleId },
                data: { permissions: { set: input.permIds.map(r => ({ id: r })) }, name: input.roleName }
            })
        }),
    createOrgRole: protectedProcedure.input(z.object(
        {
            orgId: z.string().optional(),
            roleName: nonEmptyString,
            permIds: z.array(nonEmptyString)
        }))
        .mutation(async ({ ctx, input }) => {
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid Payload",
                });
            }
            const perms = ctx.session.user.permissions

            if (!perms.includes(PERMS.manage_org_role)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.memberRole.create({
                data: { orgId: input.orgId, name: input.roleName, permissionIds: input.permIds }
            })
        }),
    deleteOrgRole: protectedProcedure.input(z.object(
        {
            roleId: nonEmptyString
        }))
        .mutation(async ({ ctx, input }) => {
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid Payload",
                });
            }
            const perms = ctx.session.user.permissions

            if (!perms.includes(PERMS.manage_org_role)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.memberRole.delete({ where: { id: input.roleId } })
        }),
});