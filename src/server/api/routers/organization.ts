import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PERMS } from "../../../_constants/perms";
import { TRPCError } from "@trpc/server";
import { nonEmptyString } from "./items";
import { $Enums } from "@prisma/client";
import { createAdminClient } from "~/utils/supabase/server";
import { isAuthorised, isAuthorised as isMemberAuthorised } from "~/utils";
import { createId } from "@paralleldrive/cuid2";

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
            if (!ctx.session.permissions.includes(PERMS.view_org_members) || !ctx.session.orgId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            if (input.orgId !== ctx.session.orgId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            const { data: org, error } = await ctx.supabase.from("Org").select("*").eq("id", input.orgId).single()
            if (error) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Failed to get org:" + error.message,
                })
            }
            return org
        }),
    getOrgRoles: protectedProcedure.input(z.object({ orgId: nonEmptyString })).query(async ({ ctx, input }) => {
        if (!input) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid Payload!" })
        }
        const userPerms = ctx.session.permissions
        if (!userPerms.includes(PERMS.view_org_members)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }

        const memberRoles = await ctx.db.memberRole.findMany({
            where: { orgId: input.orgId },
            include: { permissions: true, members: true }
        })
        const { data: userList } = await ctx.supabase.auth.admin.listUsers()

        return memberRoles.flatMap(r => ({ ...r, members: r.members.map(m => ({ ...m, user: userList.users.find(u => u.email === m.userEmail) })) }))

    }),
    updateOrgMember: protectedProcedure
        .input(z.object({ roleIds: z.string().array(), orgMemberId: nonEmptyString }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session.orgId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid Payload",
                });
            }
            const userPerms = ctx.session.permissions
            if (!userPerms.includes(PERMS.manage_org_members)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            const { data: member, error } = await ctx.supabase.from("Member").select("*").eq("id", input.orgMemberId).single()
            if (error) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Failed to get member:" + error.message,
                })
            }
            if (member.orgId !== ctx.session.orgId) {
                const isAuthorised = await isMemberAuthorised(ctx.supabase, ctx.session.orgId ?? "", member.orgId ?? "")
                if (!isAuthorised) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
            }

            // Step 1: Fetch current roles for the member
            const { data: currentRoles, error: fetchError } = await ctx.supabase
                .from('_MemberToMemberRole')
                .select('B') // Assuming B is the role ID
                .eq('A', input.orgMemberId); // Assuming A is the member ID

            if (fetchError) {
                console.error('Error fetching current roles:', fetchError);
                return;
            }

            // Step 2: Determine roles to add or remove
            const currentRoleIds = currentRoles.map(role => role.B);
            const rolesToAdd = input.roleIds.filter(roleId => !currentRoleIds.includes(roleId));
            const rolesToRemove = currentRoleIds.filter(roleId => !input.roleIds.includes(roleId));

            // Step 3: Update roles in the database
            // Add new roles
            const addPromises = rolesToAdd.map(roleId => {
                return ctx.supabase
                    .from('_MemberToMemberRole')
                    .insert([{ A: input.orgMemberId, B: roleId }]);
            });

            // Remove old roles
            const removePromises = rolesToRemove.map(roleId => {
                return ctx.supabase
                    .from('_MemberToMemberRole')
                    .delete()
                    .eq('A', input.orgMemberId)
                    .eq('B', roleId);
            });

            // Execute all add and remove operations
            const addResults = await Promise.all(addPromises);
            const removeResults = await Promise.all(removePromises);

            // Check for errors
            const addError = addResults.find(result => result.error);
            const removeError = removeResults.find(result => result.error);

            if (addError) {
                console.error('Error adding roles:', addError);
            } else {
                console.log('Roles added successfully:', addResults);
            }

            if (removeError) {
                console.error('Error removing roles:', removeError);
            } else {
                console.log('Roles removed successfully:', removeResults);
            }
            return "success"
        }),
    deleteOrgMember: protectedProcedure.input(z.object({ memberId: nonEmptyString }))
        .mutation(async ({ ctx, input }) => {
            if (!input) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid Payload",
                });
            }
            const member = await ctx.db.member.findUnique({ where: { userEmail: ctx.session.email } })
            if (member?.id === input.memberId) {

                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Kendi hesabını silemezsin!",
                });

            }
            const userPerms = ctx.session.permissions
            if (!userPerms.includes(PERMS.manage_org_members)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.member.delete({ where: { id: input.memberId } })
        }),
    getOrgMembers: protectedProcedure.input(z.object({ orgId: nonEmptyString })).query(async ({ ctx, input }) => {
        if (!input) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid Payload!" })
        }
        const userPerms = ctx.session.permissions
        if (!userPerms.includes(PERMS.view_org_members)) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        if (input.orgId !== ctx.session.orgId) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have permission to do this!",
            });
        }
        return await ctx.db.member.findMany({
            where: { orgId: input.orgId },
            include: { roles: true }
        })
    }),
    addMember: protectedProcedure.input(z.object({ orgId: z.string().optional(), email: nonEmptyString }))
        .mutation(async ({ ctx, input }) => {
            if (!input.orgId) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid Payload",
                });
            }
            const userPermission = ctx.session.permissions
            const supabase = createAdminClient();
            const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({
                page: 1,
                perPage: 9999999
            })
            console.log(authUsers);

            const invitedUser = authUsers.find(u => u.email === input.email)
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
                const { data: addedMember, error } = await ctx.supabase.from("Member").insert({
                    id: createId(),
                    orgId: input.orgId,
                    userEmail: invitedUser.email ?? "",
                    uid: invitedUser.id
                })
                if (error) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Failed to create member:" + error.message,
                    })
                }
                return addedMember
            }

            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Neither org member or dealer member",
            });
        }),

    createDealer: protectedProcedure.input(z.object({ name: nonEmptyString, price_type: nonEmptyString })).mutation(async ({ ctx, input }) => {
        const priceEnum = z.nativeEnum($Enums.PriceType);
        const priceType = priceEnum.parse(input.price_type);
        const userPerms = ctx.session.permissions

        if (!input || !priceType) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid Payload",
            });
        }
        if (ctx.session.orgId) {

            if (!userPerms.includes(PERMS.create_dealer)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            const { data: dealer, error: dealerError } = await ctx.supabase.from("Org").insert({
                id: createId(),
                name: input.name,
                type: "Dealer",
                priceType: priceType,
                orgId: ctx.session.orgId,
                updateDate: new Date().toUTCString(),
            }).select().single()
            if (dealerError) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Failed to create dealer:" + dealerError.message,
                })
            }
            const { data: permissions, error: permError } = await ctx.supabase.from("MemberPermission").select("*").eq("assignableTo", "Dealer")
            if (permError) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Failed to create dealer:" + permError.message,
                })
            }
            return await ctx.db.memberRole.create({
                data: { name: "Bayii Yöneticisi", orgId: dealer.id, permissions: { connect: permissions.map(p => ({ id: p.id })) } }
            })
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
            const userPerms = ctx.session.permissions
            const { data: role, error } = await ctx.supabase.from("MemberRole").select("*").eq("id", input.roleId).single()
            if (error) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Failed to get role:" + error.message,
                })
            }
            if (role.orgId !== ctx.session.orgId) {
                const isUserAuthorised = await isAuthorised(ctx.supabase, ctx.session.orgId ?? "", role.orgId ?? "")
                if (!isUserAuthorised) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                if (!userPerms.includes(PERMS.manage_org_role)) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You don't have permission to do this!",
                    });
                }
                return await ctx.db.memberRole.update({
                    where: { id: input.roleId },
                    data: { permissions: { set: input.permIds.map(r => ({ id: r })) }, name: input.roleName }
                })
            }
            if (!userPerms.includes(PERMS.manage_org_role)) {
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
            const perms = ctx.session.permissions

            if (!perms.includes(PERMS.manage_org_role)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            const { data: role, error } = await ctx.supabase.from("MemberRole").insert({
                id: createId(),
                orgId: input.orgId,
                name: input.roleName,
            }).select().single()
            if (error) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Failed to create role:" + error.message,
                })
            }
            input.permIds.map(async p => {
                await ctx.supabase.from("_MemberPermissionToMemberRole").insert({
                    A: p,
                    B: role.id
                })
            })
            return role
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
            const perms = ctx.session.permissions

            if (!perms.includes(PERMS.manage_org_role)) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have permission to do this!",
                });
            }
            return await ctx.db.memberRole.delete({ where: { id: input.roleId } })
        }),
});