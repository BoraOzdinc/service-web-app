import { type ColumnDef } from "@tanstack/react-table";
import { type ItemHistory } from "~/utils/useItems";

export const columns: ColumnDef<ItemHistory>[] = [
  { accessorKey: "action", header: "İşlem" },
  {
    accessorKey: "createDate",
    header: "Tarih",
    cell({
      row: {
        original: { createDate },
      },
    }) {
      return createDate.toLocaleString();
    },
  },
  {
    accessorKey: "fromStorage",
    header: "Çıkış Depo",
    cell: ({
      row: {
        original: { fromStorage },
      },
    }) => {
      return fromStorage?.name;
    },
  },
  {
    accessorKey: "toStorage",
    header: "Giriş Depo",
    cell: ({
      row: {
        original: { toStorage },
      },
    }) => {
      return toStorage?.name;
    },
  },
  { accessorKey: "quantity", header: "Adet" },
  {
    accessorKey: "user",
    header: "İşlemi Yapan",
    cell: ({
      row: {
        original: { createdBy },
      },
    }) => {
      return createdBy;
    },
  },
  {
    accessorKey: "description",
    header: "Açıklama",
  },
];
