import { type ColumnDef } from "@tanstack/react-table";
import { type RouterOutputs } from "~/trpc/shared";

type brandType = RouterOutputs["items"]["getBrands"][number];

export const columns: ColumnDef<brandType>[] = [
  { accessorKey: "name", header: "Marka" },
];
