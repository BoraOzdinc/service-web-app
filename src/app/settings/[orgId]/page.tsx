"use client";

import { Loader2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import Loader from "~/app/_components/loader";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { api } from "~/trpc/server";
import { isValidEmail } from "~/utils";
import { useCreateOrgMember } from "~/utils/useOrg";
import { PERMS } from "~/_constants/perms";
import { DataTable } from "~/app/_components/tables/generic-table";
import { columns as orgMemberColumns } from "./components/orgMembersColumns";
import {
  RoleCreateOrUpdateModal,
  columns as orgRolesColumns,
} from "./components/orgRolesColumns";
import { useSession } from "~/utils/SessionProvider";

const OrganizationSettings = () => {
  const params = useParams<{ orgId: string }>();
  const session = useSession();
  const [orgMemberEmail, setOrgMemberEmail] = useState<string | undefined>();
  const addOrgMember = useCreateOrgMember();
  const { data: org, isLoading: isOrgLoading } =
    api.organization.getOrgById.useQuery({
      orgId: params.orgId,
    });
  const { data: orgMembers, isLoading: isOrgMembersLoading } =
    api.organization.getOrgMembers.useQuery(
      { orgId: params.orgId },
      { enabled: session?.permissions.includes(PERMS.view_org_members) },
    );

  const { data: orgRoles, isLoading: isOrgRolesLoading } =
    api.organization.getOrgRoles.useQuery(
      {
        orgId: params.orgId,
      },
      { enabled: session?.permissions.includes(PERMS.view_org_role) },
    );

  const safeSession = session ?? undefined;

  const memberColumns = useMemo(() => {
    return orgMemberColumns(orgMembers?.roleList, safeSession);
  }, [orgMembers?.roleList, safeSession]);

  const rolesColumns = useMemo(() => {
    return orgRolesColumns(safeSession);
  }, [safeSession]);

  if (isOrgLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle>{org?.name}</CardTitle>
      </CardHeader>
      <div className="flex w-full flex-row gap-3">
        {safeSession?.permissions.includes(PERMS.view_org_members) && (
          <Card className="flex w-full flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className=" flex flex-row gap-3">
                <CardTitle>Organizasyon Üyeleri</CardTitle>
                {isOrgMembersLoading && (
                  <Loader2Icon className="h-5 w-5 animate-spin" />
                )}
              </div>
              {session?.permissions.includes(PERMS.manage_org_members) ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Üye Ekle</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Yeni üye</DialogTitle>
                    </DialogHeader>
                    <Label>E-Mail</Label>
                    <Input
                      placeholder="E-Mail"
                      inputMode="email"
                      value={orgMemberEmail}
                      onChange={(e) => {
                        setOrgMemberEmail(e.target.value);
                      }}
                    />
                    <Button
                      disabled={isValidEmail(orgMemberEmail) || !orgMemberEmail}
                      onClick={() =>
                        orgMemberEmail &&
                        addOrgMember.mutate({
                          email: orgMemberEmail,
                          orgId: params.orgId,
                        })
                      }
                    >
                      Üyeyi Ekle
                    </Button>
                    <DialogDescription>
                      Not: Üyenin eklenebilmesi için daha önce sisteme giriş
                      yapmış olması gerekmektedir.
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              ) : null}
            </CardHeader>
            <CardContent className="overflow-x-scroll md:overflow-x-hidden">
              <DataTable
                data={orgMembers?.members}
                isLoading={isOrgMembersLoading}
                columns={memberColumns}
                pagination
              />
            </CardContent>
          </Card>
        )}
        {safeSession?.permissions.includes(PERMS.view_org_role) && (
          <Card className="flex w-full flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className=" flex flex-row gap-3">
                <CardTitle>Organizasyon Rolleri</CardTitle>
                {isOrgRolesLoading && (
                  <Loader2Icon className="h-5 w-5 animate-spin" />
                )}
              </div>
              {session?.permissions.includes(PERMS.manage_org_role) ? (
                <RoleCreateOrUpdateModal
                  orgId={params.orgId}
                  mode="create"
                  permissions={[]}
                  roleId=""
                  roleName=""
                />
              ) : null}
            </CardHeader>
            <CardContent className="overflow-x-scroll md:overflow-x-hidden">
              <DataTable
                data={orgRoles}
                isLoading={isOrgRolesLoading}
                columns={rolesColumns}
                pagination
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrganizationSettings;
