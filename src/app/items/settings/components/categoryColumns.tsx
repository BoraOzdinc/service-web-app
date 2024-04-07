import { type ColumnDef } from "@tanstack/react-table";
import {type RouterOutputs } from "~/trpc/shared";

type categoryType = RouterOutputs["items"]["getCategory"][number]

export const columns: ColumnDef<categoryType>[] = [
  { accessorKey: "name", header: "Kategori" },
];
