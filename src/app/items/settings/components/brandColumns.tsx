import { type ColumnDef } from "@tanstack/react-table";
import { type getBrandsType } from "./queryFunctions";

type brandType = NonNullable<getBrandsType["data"]>[number];

export const columns: ColumnDef<brandType>[] = [
  { accessorKey: "name", header: "Marka" },
];
