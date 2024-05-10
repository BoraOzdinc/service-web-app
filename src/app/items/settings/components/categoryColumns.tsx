import { type ColumnDef } from "@tanstack/react-table";
import { type getCategoriesType } from "./queryFunctions";

type categoryType = NonNullable<getCategoriesType["data"]>[number];

export const columns: ColumnDef<categoryType>[] = [
  { accessorKey: "name", header: "Kategori" },
];
