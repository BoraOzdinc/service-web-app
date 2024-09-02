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
import { type getDealerTransactions } from "~/utils/useDealer";
import { transactionTypes } from "~/utils/useItems";

export const dealerTransactionsColumns: ColumnDef<getDealerTransactions>[] = [
  {
    accessorKey: "createDate",
    header: "Tarih",
    filterFn: (row, id, value: Array<string>) => {
      if (value[0] && value[1]) {
        const startDate = new Date(value[0]);
        const endDate = new Date(value[1]);
        const createdDate = new Date(row.original.createDate);
        return createdDate >= startDate && createdDate <= endDate;
      }
      return true;
    },
    cell({
      row: {
        original: { createDate },
      },
    }) {
      return new Date(createDate).toLocaleString();
    },
  },
  {
    accessorKey: "transactionType",
    header: "Satış Tipi",
    filterFn: (row, id, value: Array<string>) => {
      if (value.includes(row.original.transactionType)) {
        return true;
      }
      return false;
    },
    cell({
      row: {
        original: { transactionType },
      },
    }) {
      return transactionTypes[transactionType];
    },
  },
  {
    accessorKey: "payAmount",
    header: "Ödenen Miktar",
    cell({
      row: {
        original: { payAmount },
      },
    }) {
      return `${Number(payAmount).toFixed(2)}€`;
    },
  },
  {
    accessorKey: "exchangeRate",
    header: "Euro Kuru",
    cell({
      row: {
        original: { exchangeRate },
      },
    }) {
      return `${Number(exchangeRate).toFixed(2)}₺`;
    },
  },
  {
    accessorKey: "totalAmount",
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
    accessorKey: "id",
    header: "Borç / Alacak",
    cell({
      row: {
        original: { totalAmount, payAmount, discount },
      },
    }) {
      const discountAmount = (Number(totalAmount) * Number(discount)) / 100;
      return `${(
        Number(totalAmount) -
        discountAmount -
        Number(payAmount)
      ).toFixed(2)}€`;
    },
  },
  {
    accessorKey: "dealer",
    header: "Müşteriden Gelen Komisyon",
    cell({
      row: {
        original: { items },
      },
    }) {
      const customerTotal = items.reduce((acc, curVal) => {
        acc += Number(curVal.customerPrice) * curVal.quantity;
        return acc;
      }, 0);
      const dealerTotal = items.reduce((acc, curVal) => {
        acc += Number(curVal.dealerPrice) * curVal.quantity;
        return acc;
      }, 0);
      const diff = Math.abs(customerTotal - dealerTotal);
      return `${diff}€`;
    },
  },
  {
    accessorKey: "boughtItems",
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
          <DialogContent className="flex w-full min-w-min flex-col overflow-x-auto">
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

const itemsColumns: ColumnDef<getDealerTransactions["items"][number]>[] = [
  {
    accessorKey: "item",
    header: "Ürün",
    cell({
      row: {
        original: { item },
      },
    }) {
      return item?.name;
    },
  },
  {
    accessorKey: "itemBarcode",
    header: "Barkod",
    cell({
      row: {
        original: { item },
      },
    }) {
      const masterBarcode = item?.itemBarcode.find((b) => (b.isMaster = true));
      return masterBarcode ? masterBarcode.barcode : "-";
    },
  },
  {
    accessorKey: "itemBarcode",
    header: "Birim/Adet",
    cell({
      row: {
        original: { item },
      },
    }) {
      const masterBarcode = item?.itemBarcode.find((b) => (b.isMaster = true));
      return masterBarcode
        ? `${masterBarcode.unit} / ${masterBarcode.quantity}`
        : "-";
    },
  },
  {
    accessorKey: "quantity",
    header: "Adet",
  },
];
