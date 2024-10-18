"use client";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { Button } from "~/app/_components/ui/button";
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
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { useAddStorage, useDeleteStorage } from "~/utils/useItems";
import { api } from "~/trpc/server";
import { DataTable } from "~/app/_components/tables/generic-table";
import { type ColumnDef } from "@tanstack/react-table";
import { type RouterOutputs } from "~/trpc/shared";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";

const StorageDialog = () => {
  const addStorage = useAddStorage();
  const { data: storages, isLoading } = api.items.getStorages.useQuery({});
  const [storageInput, setStorageInput] = useState<string>();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button isLoading={isLoading} disabled={isLoading}>
          Depolar
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[98vh] w-full min-w-min flex-col overflow-x-auto">
        <DialogHeader>
          <DialogTitle>Depolar</DialogTitle>
        </DialogHeader>
        <DataTable data={storages} columns={columns} pagination />
        <div>
          <Label>Depo Adı</Label>
          <Input
            value={storageInput}
            onChange={(v) => setStorageInput(v.target.value)}
            placeholder="Depo Adı..."
          />
        </div>
        <Button
          onClick={() => {
            if (storageInput)
              addStorage.mutate({
                name: storageInput,
              });
          }}
          disabled={!storageInput}
        >
          Ekle
        </Button>
      </DialogContent>
    </Dialog>
  );
};

const columns: ColumnDef<RouterOutputs["items"]["getStorages"][number]>[] = [
  {
    accessorKey: "id",
    header: "",
    cell: ({
      row: {
        original: { id },
      },
    }) => <ActionColumn id={id} />,
  },
  { accessorKey: "name", header: "Depo Adı" },
  { accessorKey: "totalStock", header: "Depo Toplam Stok" },
];

const ActionColumn = ({ id }: { id: string }) => {
  const deleteStorage = useDeleteStorage();

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
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-red-500"
            >
              Sil
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Emin Misin?</DialogTitle>
              <DialogDescription>
                Bu depoyu silmek istediğinize emin misiniz?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"}>Vazgeç</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={() => deleteStorage.mutate(id)}
                  variant={"destructive"}
                >
                  Sil
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  return <></>;
};

export default StorageDialog;
