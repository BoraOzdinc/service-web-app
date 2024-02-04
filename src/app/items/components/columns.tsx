import { type ColumnDef } from "@tanstack/react-table";
import { type Item } from "~/utils/useItems";

export const columns: ColumnDef<Item>[] = [
  { accessorKey: "serialNo", header: "Ürün Kodu" },
  { accessorKey: "barcode", header: "Barkod" },
  { accessorKey: "name", header: "Ürün İsmi" },
  { accessorKey: "brand", header: "Marka" },
  { accessorKey: "stock", header: "Toplam Stok" },
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
