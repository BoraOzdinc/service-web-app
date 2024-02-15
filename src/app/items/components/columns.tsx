import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import { api } from "~/trpc/server";
import { useAddItem, type Item } from "~/utils/useItems";

type row = {
  totalStock: number;
  id: string;
  createDate: Date;
  updateDate: Date;
  barcode: string;
  serialNo: string;
  name: string;
  brand: string;
  popImage: string | null;
  mainDealerPrice: string;
  multiPrice: string;
  dealerPrice: string;
  singlePrice: string;
  orgId: string;
};

const ActionMenu = (Props: { row: row }) => {
  const storages = api.items.getStorages.useQuery();
  const addItem = useAddItem();
  const [selectedStorage, setSelectedStorage] = useState<string>("N/A");
  const [amountInput, setAmountInput] = useState<number>();
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DialogTrigger asChild>
            <DropdownMenuItem>Stok Ekle</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stok Ekle</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Label>Depo</Label>
          <Select onValueChange={setSelectedStorage} value={selectedStorage}>
            <SelectTrigger>
              <SelectValue placeholder="Depo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="N/A">Seçim yok</SelectItem>
              {storages.data?.map((s) => {
                return (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-3">
          <Label>Stok Adet</Label>
          <Input
            type="number"
            min={0}
            onChange={(a) => setAmountInput(Number(a.target.value))}
            value={amountInput}
            placeholder="adet"
          />
        </div>
        <Button
          disabled={!amountInput && selectedStorage === "N/A"}
          isLoading={addItem.isLoading}
          onClick={() => {
            addItem.mutate({
              storage: selectedStorage,
              productName: Props.row.name,
              barcode: Props.row.barcode,
              brand: Props.row.brand,
              dealerPrice: Props.row.dealerPrice,
              mainDealerPrice: Props.row.mainDealerPrice,
              multiPrice: Props.row.multiPrice,
              serialNo: Props.row.serialNo,
              singlePrice: Props.row.singlePrice,
              stock: amountInput!,
            });
          }}
        >
          Ekle
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export const columns: ColumnDef<Item>[] = [
  {
    id: "actions",
    cell: ({ row: { original } }) => {
      return <ActionMenu row={original} />;
    },
  },
  { accessorKey: "serialNo", header: "Ürün Kodu" },
  { accessorKey: "barcode", header: "Barkod" },
  { accessorKey: "name", header: "Ürün İsmi" },
  { accessorKey: "brand", header: "Marka" },
  { accessorKey: "totalStock", header: "Toplam Stok" },
  {
    accessorKey: "mainDealerPrice",
    header: "Anabayi Fiyatı",
    cell: ({
      row: {
        original: { mainDealerPrice },
      },
    }) => {
      return `€ ${mainDealerPrice}`;
    },
  },
  {
    accessorKey: "multiPrice",
    header: "Toptan Fiyatı",
    cell: ({
      row: {
        original: { multiPrice },
      },
    }) => {
      return `€ ${multiPrice}`;
    },
  },
  {
    accessorKey: "dealerPrice",
    header: "Bayi Fiyatı",
    cell: ({
      row: {
        original: { dealerPrice },
      },
    }) => {
      return `€ ${dealerPrice}`;
    },
  },
  {
    accessorKey: "singlePrice",
    header: "Perakende Fiyatı",
    cell: ({
      row: {
        original: { singlePrice },
      },
    }) => {
      return `€ ${singlePrice}`;
    },
  },
];
