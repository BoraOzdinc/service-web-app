import { type ColumnDef } from "@tanstack/react-table";
import { type RouterOutputs } from "~/trpc/shared";

type colorType = RouterOutputs["items"]["getColors"][number];

export const columns: ColumnDef<colorType>[] = [
  { accessorKey: "colorCode", header: "Renk Kodu" },
  { accessorKey: "colorText", header: "Renk" },
];
