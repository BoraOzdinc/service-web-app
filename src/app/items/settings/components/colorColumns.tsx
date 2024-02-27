import { type ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<{
  id: string;
  colorCode: string;
  colorText: string;
  orgId: string;
}>[] = [
  { accessorKey: "colorCode", header: "Renk Kodu" },
  { accessorKey: "colorText", header: "Renk" },
];
