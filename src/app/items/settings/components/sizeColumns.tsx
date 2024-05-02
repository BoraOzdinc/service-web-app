import { type ColumnDef } from "@tanstack/react-table";
import { type RouterOutputs } from "~/trpc/shared";

type sizeType = RouterOutputs["items"]["getSizes"][number];
export const columns: ColumnDef<sizeType>[] = [
  { accessorKey: "sizeCode", header: "Beden Kodu" },
  { accessorKey: "sizeText", header: "Beden" },
];
