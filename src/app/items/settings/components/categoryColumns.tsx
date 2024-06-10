import { type ColumnDef } from "@tanstack/react-table";
import {type RouterOutputs } from "~/trpc/shared";

type categoryType = NonNullable<RouterOutputs["items"]["getCategory"]>[number];

export const columns: ColumnDef<categoryType>[] = [
  { accessorKey: "name", header: "Kategori" },
];
