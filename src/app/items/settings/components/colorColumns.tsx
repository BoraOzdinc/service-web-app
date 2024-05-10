import { type ColumnDef } from "@tanstack/react-table";
import { type getColorsType } from "./queryFunctions";

type colorType = NonNullable<getColorsType["data"]>[number];

export const columns: ColumnDef<colorType>[] = [
  { accessorKey: "colorCode", header: "Renk Kodu" },
  { accessorKey: "colorText", header: "Renk" },
];
