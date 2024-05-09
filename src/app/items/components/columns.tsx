import { type ColumnDef } from "@tanstack/react-table";
import { type SingleItemType } from "./ItemsListComponent";

export const columns: ColumnDef<SingleItemType>[] = [
  { accessorKey: "itemCode", header: "Ürün Kodu" },
  {
    accessorKey: "itemBarcode",
    header: "Barkod",
    cell: ({
      row: {
        original: { itemBarcode },
      },
    }) => {
      return itemBarcode.map((b) => {
        if (!b.isMaster) {
          return "-";
        }
        return b.barcode;
      })[0];
    },
  },
  { accessorKey: "name", header: "Ürün İsmi" },
  {
    accessorKey: "itemColorId",
    header: "Renk",
    filterFn: (row, id, value: Array<string>) => {
      return value.includes(row.original.ItemColor?.colorCode ?? "");
    },
    cell: ({
      row: {
        original: { ItemColor },
      },
    }) => {
      return `${ItemColor?.colorCode} ${ItemColor?.colorText}`;
    },
  },
  {
    accessorKey: "itemSizeId",
    header: "Beden",
    filterFn: (row, id, value: Array<string>) => {
      return value.includes(row.original.ItemSize?.sizeCode ?? "");
    },
    cell: ({
      row: {
        original: { ItemSize },
      },
    }) => {
      return ItemSize?.sizeCode;
    },
  },
  {
    accessorKey: "itemCategoryId",
    header: "Kategori",
    filterFn: (row, id, value: Array<string>) => {
      return value.includes(row.original.ItemCategory?.name ?? "");
    },
    cell: ({
      row: {
        original: { ItemCategory },
      },
    }) => {
      return ItemCategory?.name;
    },
  },
  {
    accessorKey: "itemBrandId",
    header: "Marka",
    filterFn: (row, id, value: Array<string>) => {
      return value.includes(row.original.ItemBrand?.name ?? "");
    },
    cell: ({
      row: {
        original: { ItemBrand },
      },
    }) => {
      return ItemBrand?.name;
    },
  },

  {
    accessorKey: "mainDealerPrice",
    header: "Anabayi Fiyatı",
    cell: ({
      row: {
        original: { mainDealerPrice },
      },
    }) => {
      return mainDealerPrice ? `€ ${mainDealerPrice}` : "-";
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
      return multiPrice ? `€ ${multiPrice}` : "-";
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
      return dealerPrice ? `€ ${dealerPrice}` : "-";
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
      return singlePrice ? `€ ${singlePrice}` : "-";
    },
  },
  {
    accessorKey: "totalStock",
    header: "Toplam Stok",
    filterFn: (row, id, value: Array<string>) => {
      return Boolean(
        row.original.ItemStock.find((i) =>
          value.includes(String(i.Storage?.id)),
        ),
      );
    },
  },
];
