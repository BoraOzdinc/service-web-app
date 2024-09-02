import { type ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, PackageIcon } from "lucide-react";
import { useState } from "react";
import { DataTable } from "~/app/_components/tables/generic-table";
import { Badge } from "~/app/_components/ui/badge";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { usePayDebt, type customerTransaction } from "~/utils/useCustomers";
import { transactionTypes } from "~/utils/useItems";

const ActionColumn = ({
  totalAmount,
  discount,
  payAmount,
  transactionId,
}: {
  totalAmount: string | null;
  discount: string | null;
  payAmount: string | null;
  transactionId: string;
}) => {
  const payDebt = usePayDebt();
  const [amount, setAmount] = useState(0);
  const discountedAmount =
    Number(totalAmount) -
    (Number(totalAmount) * Number(discount)) / 100 -
    Number(payAmount);
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
              disabled={discountedAmount === 0}
            >
              Ödeme Yap
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ödeme Yap</DialogTitle>
              <DialogDescription>
                Kalan Borç {discountedAmount.toFixed(2)}€
              </DialogDescription>
            </DialogHeader>
            <div>
              <Label>Ödenen Miktar (€)</Label>
              <Input
                placeholder="Miktar"
                value={amount}
                type="number"
                inputMode="numeric"
                onChange={(e) => {
                  if (
                    Number(e.target.value) > Number(discountedAmount.toFixed(2))
                  ) {
                    setAmount(Number(discountedAmount.toFixed(2)));
                  } else if (Number(e.target.value) < 0) {
                    setAmount(0);
                  } else {
                    setAmount(Number(e.target.value));
                  }
                }}
              />
            </div>
            <DialogClose asChild>
              <Button
                disabled={
                  amount <= 0 || amount > Number(discountedAmount.toFixed(2))
                }
                isLoading={payDebt.isLoading}
                onClick={() =>
                  payDebt.mutate({
                    paidAmount: amount,
                    transactionId: transactionId,
                  })
                }
              >
                Onayla
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const customerTransactionColumns: ColumnDef<customerTransaction>[] = [
  {
    accessorKey: "action",
    header: "",
    cell({ row: { original } }) {
      return (
        <ActionColumn
          discount={original.discount}
          totalAmount={original.totalAmount}
          transactionId={original.id}
          payAmount={original.payAmount}
        />
      );
    },
  },
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
    }): string {
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
        original: { totalAmount, exchangeRate },
      },
    }) {
      return `${totalAmount}€ - ${(
        Number(totalAmount) * Number(exchangeRate)
      ).toFixed(2)}₺`;
    },
  },
  {
    accessorKey: "discount",
    header: "İndirim",
    cell({
      row: {
        original: { discount },
      },
    }) {
      return `%${Number(discount).toFixed(2)}`;
    },
  },
  {
    accessorKey: "id",
    header: "Kalan Borç",
    cell({
      row: {
        original: { totalAmount, payAmount, discount },
      },
    }) {
      const discountedAmount =
        Number(totalAmount) -
        (Number(totalAmount) * Number(discount)) / 100 -
        Number(payAmount);
      return `${discountedAmount.toFixed(2)}€`;
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

const itemsColumns: ColumnDef<customerTransaction["items"][number]>[] = [
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
      const masterBarcode = itemBarcode.find((b) => (b.isMaster = true));
      return masterBarcode ? masterBarcode.barcode : "-";
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
      const masterBarcode = itemBarcode.find((b) => (b.isMaster = true));
      return masterBarcode
        ? `${masterBarcode.unit} / ${masterBarcode.quantity}`
        : "-";
    },
  },
  {
    accessorKey: "quantity",
    header: "Adet",
  },
  {
    accessorKey: "item",
    header: "Seri Numaraları",
    cell({
      row: {
        original: { serialNumbers },
      },
    }) {
      return serialNumbers.map((s) => <Badge key={s}>{s}</Badge>);
    },
  },
];
