import { type ColumnDef } from "@tanstack/react-table";
import { type Item } from "~/utils/useItems";

export const columns: ColumnDef<Item>[] = [
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
      return value.includes(row.original.color.colorCode);
    },
    cell: ({
      row: {
        original: {
          color: { colorCode, colorText },
        },
      },
    }) => {
      return `${colorCode} ${colorText}`;
    },
  },
  {
    accessorKey: "itemSizeId",
    header: "Beden",
    filterFn: (row, id, value: Array<string>) => {
      return value.includes(row.original.size.sizeCode);
    },
    cell: ({
      row: {
        original: {
          size: { sizeCode },
        },
      },
    }) => {
      return sizeCode;
    },
  },
  {
    accessorKey: "itemCategoryId",
    header: "Kategori",
    filterFn: (row, id, value: Array<string>) => {
      return value.includes(row.original.category.name);
    },
    cell: ({
      row: {
        original: {
          category: { name },
        },
      },
    }) => {
      return name;
    },
  },
  {
    accessorKey: "itemBrandId",
    header: "Marka",
    filterFn: (row, id, value: Array<string>) => {
      return value.includes(row.original.brand.name);
    },
    cell: ({
      row: {
        original: { brand },
      },
    }) => {
      return brand.name;
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
        row.original.ItemStock.find((i) => value.includes(i.storage.id)),
      );
    },
  },
];
