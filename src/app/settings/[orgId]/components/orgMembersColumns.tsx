import { type ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { PERMS } from "~/_constants/perms";
import { Button } from "~/app/_components/ui/button";
import { Checkbox } from "~/app/_components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { ScrollArea } from "~/app/_components/ui/scroll-area";
import { type RouterOutputs } from "~/trpc/shared";
import { useDeleteOrgMember, useUpdateOrgMember } from "~/utils/useOrg";

export type orgMemberType =
  RouterOutputs["organization"]["getOrgMembers"][number];

export type orgRolesType = RouterOutputs["organization"]["getOrgRoles"];

const ActionColumn = ({
  member,
  roles,
}: {
  member: orgMemberType;
  roles: orgRolesType;
}) => {
  const updateMember = useUpdateOrgMember();
  const deleteMember = useDeleteOrgMember();
  const [checkedRole, setCheckedRole] = useState<string[]>(
    member.roles.map((p) => p.id),
  );

  const handleCheck = (id: string, isChecked: boolean) => {
    setCheckedRole((prevState) => {
      if (!isChecked) {
        return [...prevState, id];
      } else {
        return prevState.filter((permissionId) => permissionId !== id);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"}>
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Düzenle
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="flex flex-row gap-3">
              <DialogTitle>Üye Düzenle</DialogTitle>
            </DialogHeader>
            {/* <div>
              <Label>Üye ismi</Label>
              <Input placeholder="İsim" disabled value={member.user.name!} />
            </div> */}
            <div>
              <Label>E-Mail</Label>
              <Input placeholder="E-Mail" disabled value={member.userEmail} />
            </div>
            <div>
              <Label>Roller</Label>
              <ScrollArea className="max-h-52 rounded-md border">
                <div className="flex flex-col gap-3 p-4">
                  {roles?.map((role) => {
                    const isChecked = !!checkedRole.find((p) => p === role.id);

                    return (
                      <div key={role.id} className="items-top flex space-x-2">
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={isChecked}
                          onClick={() => handleCheck(role.id, isChecked)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={`role-${role.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {role.name}
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
            <Button
              disabled={
                JSON.stringify(member.roles.map((p) => p.id).sort()) ===
                  JSON.stringify(checkedRole.sort()) || updateMember.isLoading
              }
              isLoading={updateMember.isLoading}
              onClick={() =>
                updateMember.mutate({
                  roleIds: checkedRole,
                  orgMemberId: member.id,
                })
              }
            >
              Onayla
            </Button>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-red-600"
            >
              Üyeyi Çıkar
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Emin misin?</DialogTitle>
              <DialogDescription>
                Bu işlem üyeyi Bayii den çıkartır! Emin misin?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"}>Vazgeç</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant={"destructive"}
                  onClick={() => deleteMember.mutate({ memberId: member.id })}
                >
                  Üyeyi Sil
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: (
  dealerRoles: orgRolesType | undefined,
  session:
    | {
        permissions: string[];
        orgId: string | null | undefined;
        email: string | undefined;
      }
    | undefined,
) => ColumnDef<orgMemberType>[] = (orgRoles, session) => [
  {
    id: "action",
    cell({ row: { original } }) {
      if (session?.permissions.includes(PERMS.manage_org_members)) {
        return <ActionColumn member={original} roles={orgRoles ?? []} />;
      }
      return null;
    },
  },
  /* {
    accessorKey: "id",
    header: "Kullanıcı Adı",
    cell: ({
      row: {
        original: { user },
      },
    }) => {
      return user.name;
    },
  }, */
  {
    accessorKey: "userEmail",
    header: "E-Mail",
    cell: ({
      row: {
        original: { userEmail },
      },
    }) => {
      return userEmail;
    },
  },
  {
    accessorKey: "role",
    header: "Roller",
    cell: ({
      row: {
        original: { roles },
      },
    }) => {
      return roles.length;
    },
  },
];
