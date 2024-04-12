import { type ColumnDef } from "@tanstack/react-table";
import { PackageIcon } from "lucide-react";
import { DataTable } from "~/app/_components/tables/generic-table";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { type ItemAcceptHistory } from "~/utils/useItems";

export const columns: ColumnDef<ItemAcceptHistory>[] = [
  {
    accessorKey: "createDate",
    header: "Tarih",
    filterFn: (row, id, value: Array<string>) => {
      if (value[0] && value[1]) {
        const startDate = new Date(value[0]);
        const endDate = new Date(value[1]);
        return (
          row.original.createDate >= startDate &&
          row.original.createDate <= endDate
        );
      }
      return true;
    },
    cell({
      row: {
        original: { createDate },
      },
    }) {
      return createDate.toLocaleString();
    },
  },
  {
    accessorKey: "from",
    header: "Kimden",
    cell({
      row: {
        original: { from },
      },
    }) {
      return <div>{`${from.companyName} ${from.name} ${from.surname}`}</div>;
    },
  },
  {
    accessorKey: "storage",
    header: "Depo",
    cell({
      row: {
        original: {
          storage: { name },
        },
      },
    }) {
      return name;
    },
  },
  {
    accessorKey: "name",
    header: "İşlemi Yapan",
  },
  {
    accessorKey: "items",
    header: "Ürünler",
    cell({
      row: {
        original: { items },
      },
    }) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"outline"}>
              <PackageIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ürünler</DialogTitle>
            </DialogHeader>
            <DataTable data={items} columns={itemsColumns} isLoading={!items} />
          </DialogContent>
        </Dialog>
      );
    },
  },
];

const itemsColumns: ColumnDef<ItemAcceptHistory["items"][number]>[] = [
  {
    accessorKey: "item",
    header: "Ürün",
    cell({
      row: {
        original: {
          item: { name },
        },
      },
    }) {
      return name;
    },
  },
  {
    accessorKey: "quantity",
    header: "Adet",
  },
];
