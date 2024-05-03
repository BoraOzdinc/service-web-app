import { PERMS } from "~/_constants/perms";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { nonEmptyString } from "./items";
import { z } from "zod";


export const dealerRouter = createTRPCRouter({
    createDealerRole: protectedProcedure.input(z.object(
        {
            dealerId: z.string().optional(),
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
            const perms = ctx.session.permissions

            if (!perms.includes(PERMS.manage_dealer_role)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.memberRole.create({
                data: { dealerId: input.dealerId, name: input.roleName, permissions: { connect: input.permIds.map(p => ({ id: p })) } }
            })
        }),
    deleteDealerRole: protectedProcedure.input(z.object(
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
            const perms = ctx.session.permissions

            if (!perms.includes(PERMS.manage_dealer_role)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.memberRole.delete({ where: { id: input.roleId } })
        }),
    getDealers: protectedProcedure.query(async ({ ctx }) => {
        if (!ctx.session.orgId) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }

        if (!ctx.session.permissions.includes(PERMS.dealers_view)
        ) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        const dealers = await ctx.db.dealer.findMany({
            where: { orgId: ctx.session.orgId },
            include: { members: true, items: true, views: true }
        })
        return dealers

    }),
    getDealerById: protectedProcedure.input(nonEmptyString).query(async ({ ctx, input }) => {
        if (!input) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid Payload!" })
        }
        const userPerms = ctx.session.permissions

        if (!userPerms.includes(PERMS.dealers_view)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }

        const dealer = await ctx.db.dealer.findMany({
            where: {
                id: ctx.session.dealerId ?? undefined,
                orgId: ctx.session.orgId ?? undefined,
            },
            include: { members: true, items: true, views: true }

        })

        if (!dealer.find((d) => d.id === input)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        return await ctx.db.dealer.findUnique({
            where: { id: input },
            include: { members: true, items: true, views: true }
        })

    }),
    getDealerMembers: protectedProcedure.input(nonEmptyString).query(async ({ ctx, input }) => {
        if (!input) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid Payload!" })
        }
        const userPerms = ctx.session.permissions
        if (!userPerms.includes(PERMS.view_dealer_members)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        const dealer = await ctx.db.dealer.findMany({
            where: {
                id: ctx.session.dealerId ?? undefined,
                orgId: ctx.session.orgId ?? undefined
            },
            include: { members: true, items: true, views: true }

        })

        if (!dealer.find((d) => d.id === input)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        return await ctx.db.member.findMany({
            where: { dealerId: input },
            include: { roles: true, dealer: true }
        })
    }),
    getDealerMemberById: protectedProcedure.input(nonEmptyString).query(async ({ ctx, input }) => {
        if (!input) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid Payload!" })
        }
        const userPerms = ctx.session.permissions
        if (!userPerms.includes(PERMS.view_dealer_members)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        const members = await ctx.db.member.findMany({
            where: { dealerId: input },
            include: { roles: true }
        })
        const { data: userList } = await ctx.supabase.auth.admin.listUsers()

        return members.flatMap(r => ({ ...r, user: userList.users.find(u => u.email === r.userEmail) }))

    }),
    getDealerRoles: protectedProcedure.input(nonEmptyString).query(async ({ ctx, input }) => {
        if (!input) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid Payload!" })
        }
        const userPerms = ctx.session.permissions
        if (!userPerms.includes(PERMS.view_dealer_role)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        const dealer = await ctx.db.dealer.findMany({
            where: {
                id: ctx.session.dealerId ?? undefined,
                orgId: ctx.session.orgId ?? undefined,
            },
            include: { members: true, items: true, views: true }

        })

        if (!dealer.find((d) => d.id === input)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        const memberRoles = await ctx.db.memberRole.findMany({
            where: { dealerId: input },
            include: { permissions: true, members: true }
        })
        const { data: userList } = await ctx.supabase.auth.admin.listUsers()

        return memberRoles.flatMap(r => ({ ...r, members: r.members.map(m => ({ ...m, user: userList.users.find(u => u.email === m.userEmail) })) }))

    }),
    getDealerPerms: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.memberPermission.findMany({ where: { assignableTo: { has: "Dealer" } } })
    }),

    updateDealerMember: protectedProcedure
        .input(z.object({ roleIds: z.string().array(), dealerMemberId: nonEmptyString }))
        .mutation(async ({ ctx, input }) => {
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid Payload",
                });
            }
            const userPerms = ctx.session.permissions
            if (!userPerms.includes(PERMS.manage_dealer_members)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            const Org = await ctx.db.org.findFirst({
                where: {

                    id: ctx.session.orgId ?? undefined,
                    dealers: {
                        some: { id: ctx.session.dealerId ?? undefined }
                    },
                },
                include: { dealers: { include: { members: true } } }
            })
            if (!Org) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            if (!Org.dealers.find((d) => d.members.find((m) => m.id === input.dealerMemberId))) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.member.update({
                where: { id: input.dealerMemberId },
                data: { roles: { set: input.roleIds.map(r => ({ id: r })) } },

            })
        }),
    deleteDealerMember: protectedProcedure.input(z.object({ memberId: nonEmptyString }))
        .mutation(async ({ ctx, input }) => {
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid Payload",
                });
            }
            const userPerms = ctx.session.permissions
            if (!userPerms.includes(PERMS.manage_dealer_members)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            const member = await ctx.db.member.findUnique({ where: { id: input.memberId } })
            if (member?.id === ctx.session.id) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Kendi Hesabını Silemezsin!",
                });
            }
            return await ctx.db.member.delete({ where: { id: input.memberId } })
        }),
    getDealerTransactions: protectedProcedure.input(nonEmptyString).query(async ({ ctx, input }) => {
        const userPerms = ctx.session.permissions

        if (!userPerms.includes(PERMS.dealers_view)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        return await ctx.db.transaction.findMany({
            where: {
                dealerId: input
            },
            include: {
                boughtItems: { include: { item: { include: { itemBarcode: true } } } },
                customer: true,
                dealer: true
            },
            orderBy: { createDate: "desc" }
        })

    })

})