import { type $Enums } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import {
  LockIcon,
  EllipsisVertical,
  Loader2Icon,
  UsersIcon,
} from "lucide-react";
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
import { api } from "~/trpc/server";
import { type RouterOutputs } from "~/trpc/shared";
import { useCreateDealerRole, useDeleteDealerRole } from "~/utils/useDealer";
import { useUpdateRole } from "~/utils/useOrg";

export type dealerRolesType = RouterOutputs["dealer"]["getDealerRoles"][number];

export const RoleCreateOrUpdateModal = ({
  permissions,
  roleId,
  dealerId,
  roleName,
  mode,
}: {
  permissions: {
    id: string;
    name: string;
    description: string;
    assignableTo: $Enums.MemberType[] | null;
  }[];
  roleId: string;
  dealerId: string;
  roleName: string;
  mode: "update" | "create";
}) => {
  const dealerPerms = api.dealer.getDealerPerms.useQuery();
  const updateRole = useUpdateRole();
  const createRole = useCreateDealerRole();
  const deleteRole = useDeleteDealerRole();
  const [name, setName] = useState<string>(roleName);
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>(
    permissions.map((p) => p.id),
  );

  const handleCheck = (id: string, isChecked: boolean) => {
    setCheckedPermissions((prevState) => {
      if (!isChecked) {
        return [...prevState, id];
      } else {
        return prevState.filter((permissionId) => permissionId !== id);
      }
    });
  };

  return (
    <Dialog
      onOpenChange={() => setCheckedPermissions(permissions.map((p) => p.id))}
    >
      {mode === "update" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"}>
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DialogTrigger asChild>
              <DropdownMenuItem>Düzenle</DropdownMenuItem>
            </DialogTrigger>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  className="text-red-600"
                  onSelect={(e) => e.preventDefault()}
                >
                  Rolü Sil
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Emin misin?</DialogTitle>
                  <DialogDescription>
                    Rol kalıcı olarak silinecek ve bu role dahip olan üyelerin
                    yetkileri alınacak! Emin misin?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant={"outline"}>Vazgeç</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      onClick={() => deleteRole.mutate({ roleId })}
                      variant={"destructive"}
                    >
                      Rolü Sil
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {mode === "create" && (
        <DialogTrigger asChild>
          <Button>Rol Ekle</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader className="flex flex-row gap-3">
          <DialogTitle>Rol Düzenle</DialogTitle>
          {dealerPerms.isLoading && (
            <Loader2Icon className="h-5 w-5 animate-spin" />
          )}
        </DialogHeader>
        <div>
          <Label>Rol ismi</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="İsim"
          />
        </div>
        <ScrollArea className="max-h-52 rounded-md border">
          <div className="flex flex-col gap-3 p-4">
            {dealerPerms.data?.map((perm) => {
              const isChecked = !!checkedPermissions.find((p) => p === perm.id);

              return (
                <div key={perm.id} className="items-top flex space-x-2">
                  <Checkbox
                    id={`perm-${perm.id}`}
                    checked={isChecked}
                    onClick={() => handleCheck(perm.id, isChecked)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={`perm-${perm.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {perm.name}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {perm.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        {mode === "update" && (
          <Button
            disabled={
              updateRole.isLoading ||
              (JSON.stringify(permissions.map((p) => p.id).sort()) ===
                JSON.stringify(checkedPermissions.sort()) &&
                roleName === name)
            }
            isLoading={updateRole.isLoading}
            onClick={() =>
              updateRole.mutate({
                permIds: checkedPermissions,
                roleId: roleId,
                roleName: name,
              })
            }
          >
            Onayla
          </Button>
        )}
        {mode === "create" && (
          <Button
            disabled={
              createRole.isLoading ||
              (JSON.stringify(permissions.map((p) => p.id).sort()) ===
                JSON.stringify(checkedPermissions.sort()) &&
                roleName === name)
            }
            isLoading={createRole.isLoading}
            onClick={() =>
              createRole.mutate({
                permIds: checkedPermissions,
                roleName: name,
                dealerId: dealerId,
              })
            }
          >
            Onayla
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const columns: ColumnDef<dealerRolesType>[] = [
  {
    id: "action",
    cell({
      row: {
        original: { permissions, id, name },
      },
    }) {
      return (
        <RoleCreateOrUpdateModal
          permissions={permissions}
          roleId={id}
          roleName={name}
          mode="update"
          dealerId=""
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Rol",
  },
  {
    accessorKey: "permissions",
    header: "Yetkiler",
    cell({
      row: {
        original: { permissions },
      },
    }) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"ghost"}>
              <LockIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yetkiler</DialogTitle>
            </DialogHeader>
            <ul className="list-disc p-3">
              {permissions.map((p) => (
                <li key={p.id}>{p.name}</li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "members",
    header: "Üyeler",
    cell({
      row: {
        original: { members },
      },
    }) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"ghost"}>
              <UsersIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Üyeler</DialogTitle>
            </DialogHeader>
            <ul className="list-disc p-3">
              {members.map((p) => (
                <li key={p.user?.id}>{p.user?.email}</li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
