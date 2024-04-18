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
import { transactionTypes, type ItemSellHistory } from "~/utils/useItems";

export const columns: ColumnDef<ItemSellHistory>[] = [
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
    accessorKey: "transactionType",
    header: "Tip",
    cell({
      row: {
        original: { transactionType },
      },
    }) {
      return transactionTypes[transactionType];
    },
  },
  {
    accessorKey: "to",
    header: "Kime",
    cell({
      row: {
        original: { to },
      },
    }) {
      return (
        <div>
          {to.companyName
            ? `${to.companyName} ${to.name} ${to.surname}`
            : `${to.name} ${to.surname}`}
        </div>
      );
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
    accessorKey: "connectedTransaction",
    header: "Toplam Fiyat",
    cell({
      row: {
        original: {
          connectedTransaction: { totalAmount },
        },
      },
    }) {
      return `${totalAmount}€`;
    },
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
          <DialogContent className="flex w-full flex-col overflow-x-auto">
            <DialogHeader>
              <DialogTitle>Ürünler</DialogTitle>
            </DialogHeader>
            <div className="w-full">
              <DataTable
                data={items}
                columns={itemsColumns}
                isLoading={!items}
              />
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

const itemsColumns: ColumnDef<ItemSellHistory["items"][number]>[] = [
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
    accessorKey: "itemBarcode",
    header: "Barkod",
    cell({
      row: {
        original: {
          item: { itemBarcode },
        },
      },
    }) {
      return itemBarcode.find((b) => b.isMaster)?.barcode;
    },
  },
  {
    accessorKey: "itemBarcode",
    header: "Birim/Adet",
    cell({
      row: {
        original: {
          item: { itemBarcode },
        },
      },
    }) {
      return `${itemBarcode.find((b) => b.isMaster)?.unit} / ${itemBarcode.find(
        (b) => b.isMaster,
      )?.quantity}`;
    },
  },
  {
    accessorKey: "quantity",
    header: "Adet",
  },
];
