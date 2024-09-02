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
                data: { orgId: input.dealerId, name: input.roleName, permissions: { connect: input.permIds.map(p => ({ id: p })) } }
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
        const dealerIds = (await ctx.supabase.from("DealerRelation").select("*").eq("parentOrgId", ctx.session.orgId)).data?.map(data => data.dealerId)

        if (!dealerIds) {
            return []
        }
        const dealers = await ctx.supabase.from("Org").select("*,Member(id),Item(id)").in("id", dealerIds)
        return dealers.data ?? []

    }),
    getDealerById: protectedProcedure.input(nonEmptyString).query(async ({ ctx, input }) => {
        if (!input) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid Payload!" })
        }
        if (!ctx.session.orgId) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        const userPerms = ctx.session.permissions

        if (!userPerms.includes(PERMS.dealers_view)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }

        const dealers = (await ctx.supabase.from("DealerRelation").select("*").eq("parentOrgId", ctx.session.orgId)).data?.map(data => data.dealerId) ?? []


        if (!dealers.find((d) => d === input)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        return await ctx.supabase.from("Org").select("*,Member(id),Item(id)").eq("id", input)

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
        if (!ctx.session.orgId) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        const dealers = (await ctx.supabase.from("DealerRelation").select("*").eq("parentOrgId", ctx.session.orgId)).data?.map(data => data.dealerId) ?? []


        if (!dealers.find((d) => d === input)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        return await ctx.db.member.findMany({
            where: { orgId: input },
            include: { roles: true, org: true }
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
            where: { orgId: input },
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
        if (!ctx.session.orgId) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        const dealers = (await ctx.supabase.from("DealerRelation").select("*").eq("parentOrgId", ctx.session.orgId)).data?.map(data => data.dealerId) ?? []


        if (!dealers.find((d) => d === input)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        const memberRoles = await ctx.db.memberRole.findMany({
            where: { orgId: input },
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
                },
                include: { parentRelations: { include: { dealer: { include: { members: true } } } } }
            })
            console.log(Org);

            if (!Org) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            if (!Org.parentRelations.find((d) => d.dealer.members.find((m) => m.id === input.dealerMemberId))) {
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
            if (member?.userEmail === ctx.session.email) {
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
        const { data: dealerTransactions, error } = await ctx.supabase.from("Transaction").select("*,dealer:Org!Transaction_transferredDealerId_fkey(*),customer:Customer(*),items:TransactionItemDetail(*,item:Item(*,itemBarcode(*)))").eq("transferredDealerId", input).order("createDate", { ascending: false })
        if (error) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to get dealer transactions:" + error.message,
            })
        }
        return dealerTransactions


    })

})