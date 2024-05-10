import { type ColumnDef } from "@tanstack/react-table";
import { type getSizesType } from "./queryFunctions";

type sizeType = NonNullable<getSizesType["data"]>[number];
export const columns: ColumnDef<sizeType>[] = [
  { accessorKey: "sizeCode", header: "Beden Kodu" },
  { accessorKey: "sizeText", header: "Beden" },
];
