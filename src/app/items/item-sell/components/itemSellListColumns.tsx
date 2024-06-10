import { type ColumnDef } from "@tanstack/react-table";
import { PackageIcon } from "lucide-react";
import { DataTable } from "~/app/_components/tables/generic-table";
import { Badge } from "~/app/_components/ui/badge";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/app/_components/ui/tooltip";
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
        original: { customer },
      },
    }) {
      return (
        <div>
          {customer.companyName
            ? `${customer.companyName} ${customer.name} ${customer.surname}`
            : `${customer.name} ${customer.surname}`}
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
    accessorKey: "employee",
    header: "İşlemi Yapan",
    cell({
      row: {
        original: { employee },
      },
    }) {
      return employee?.userEmail;
    },
  },
  {
    accessorKey: "connectedTransaction",
    header: "Toplam Fiyat",
    cell({
      row: {
        original: { totalAmount },
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
          <DialogContent className="max-h-min max-w-min overflow-scroll sm:overflow-hidden">
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
      return itemBarcode.map((b) => {
        if (!b.isMaster) {
          return "-";
        }
        if (b.barcode.length > 15) {
          return (
            <TooltipProvider key={b.id}>
              <Tooltip>
                <TooltipTrigger className="underline">
                  {b.barcode.slice(0, 15)}...
                </TooltipTrigger>
                <TooltipContent>{b.barcode}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }
        return b.barcode;
      })[0];
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
  {
    accessorKey: "serialNumbers",
    header: "Seri Numaraları",
    cell({
      row: {
        original: { serialNumbers },
      },
    }) {
      if (!serialNumbers.length) {
        return "-";
      }
      return serialNumbers.map((s) => <Badge key={s}>{s}</Badge>);
    },
  },
];
