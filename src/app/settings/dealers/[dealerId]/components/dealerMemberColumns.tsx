import { type ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
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
import {
  useDeleteDealerMember,
  useUpdateDealerMember,
} from "~/utils/useDealer";

export type dealerMemberType =
  RouterOutputs["dealer"]["getDealerMembers"][number];

export type dealerRolesType = RouterOutputs["dealer"]["getDealerRoles"];

const ActionColumn = ({
  member,
  roles,
}: {
  member: dealerMemberType;
  roles: dealerRolesType;
}) => {
  const updateMember = useUpdateDealerMember();
  const deleteUser = useDeleteDealerMember();
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
                  {roles.map((role) => {
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
                  dealerMemberId: member.id,
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
                  onClick={() => deleteUser.mutate({ memberId: member.id })}
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
  dealerRoles: dealerRolesType | undefined,
) => ColumnDef<dealerMemberType>[] = (dealerRoles) => [
  {
    id: "action",
    cell({ row: { original } }) {
      if (dealerRoles) {
        return <ActionColumn member={original} roles={dealerRoles} />;
      }
      return null;
    },
  },
  {
    accessorKey: "userEmail",
    header: "E-Mail",
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
