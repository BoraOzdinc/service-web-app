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
      return value.includes(row.getValue(id));
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
      return value.includes(row.getValue(id));
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
      return value.includes(row.getValue(id));
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
      return value.includes(row.getValue(id));
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
    accessorKey: "totalStock",
    header: "Toplam Stok",
    filterFn: (row, id, value: Array<string>) => {
      return Boolean(
        row.original.ItemStock.find((i) => value.includes(i.storage.id)),
      );
    },
  },
];
