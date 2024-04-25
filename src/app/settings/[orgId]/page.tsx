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
import { useQuery } from "@tanstack/react-query";
import { getSession } from "~/utils/getSession";

const OrganizationSettings = () => {
  const params = useParams<{ orgId: string }>();
  const { data: session } = useQuery({ queryFn: getSession });
  const [orgMemberEmail, setOrgMemberEmail] = useState<string | undefined>();
  const addOrgMember = useCreateOrgMember();
  const { data: org, isLoading: isOrgLoading } =
    api.organization.getOrgById.useQuery({
      orgId: params.orgId,
    });
  const { data: orgMembers, isLoading: isOrgMembersLoading } =
    api.organization.getOrgMembers.useQuery({ orgId: params.orgId });

  const { data: orgRoles, isLoading: isOrgRolesLoading } =
    api.organization.getOrgRoles.useQuery({
      orgId: params.orgId,
    });
  const memberColumns = useMemo(() => {
    return orgMemberColumns(orgRoles, session);
  }, [orgRoles, session]);

  if (isOrgLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle>{org?.orgName}</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Card>
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
              data={orgMembers}
              isLoading={isOrgMembersLoading}
              columns={memberColumns}
              pagination
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className=" flex flex-row gap-3">
              <CardTitle>Organizasyon Rolleri</CardTitle>
              {isOrgRolesLoading && (
                <Loader2Icon className="h-5 w-5 animate-spin" />
              )}
            </div>

            <RoleCreateOrUpdateModal
              orgId={params.orgId}
              mode="create"
              permissions={[]}
              roleId=""
              roleName=""
            />
          </CardHeader>
          <CardContent className="overflow-x-scroll md:overflow-x-hidden">
            <DataTable
              data={orgRoles}
              isLoading={isOrgRolesLoading}
              columns={orgRolesColumns}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationSettings;
