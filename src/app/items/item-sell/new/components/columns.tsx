import { type ColumnDef } from "@tanstack/react-table";
import { type ItemWithBarcode } from "~/utils/useItems";

export const columns: (selectedPriceType?: string) => ColumnDef<{
  item: ItemWithBarcode;
  barcode: string;
  quantity: number;
  totalAdded: number;
}>[] = (selectedPriceType) => [
  { accessorKey: "barcode", header: "Barkod" },
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
    accessorKey: "totalAdded",
    header: "Toplam Adet",
  },
  {
    accessorKey: "quantity",
    header: "Fiyat",
    cell({
      row: {
        original: { item },
      },
    }) {
      let price;
      if (selectedPriceType === "mainDealerPrice") {
        price = item?.mainDealerPrice;
      } else if (selectedPriceType === "multiPrice") {
        price = item?.multiPrice;
      } else if (selectedPriceType === "dealerPrice") {
        price = item?.dealerPrice;
      } else if (selectedPriceType === "singlePrice") {
        price = item?.singlePrice;
      }
      return price ? `${price}€` : "-";
    },
  },
];
