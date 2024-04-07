import { type ColumnDef } from "@tanstack/react-table";
import { type ItemHistory } from "~/utils/useItems";

export const columns: ColumnDef<ItemHistory>[] = [
  { accessorKey: "description", header: "İşlem" },
  { accessorKey: "createDate", header: "Tarih" },
  {
    accessorKey: "fromStorage",
    header: "from",
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
    header: "to",
    cell: ({
      row: {
        original: { toStorage },
      },
    }) => {
      return toStorage?.name;
    },
  },
  {
    accessorKey: "user",
    header: "işlemi yapan",
    cell: ({
      row: {
        original: { createdBy },
      },
    }) => {
      return createdBy;
    },
  },
];
