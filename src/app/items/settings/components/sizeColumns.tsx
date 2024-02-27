import { type ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<{
  id: string;
  sizeCode: string;
  sizeText: string;
  orgId: string;
}>[] = [
  { accessorKey: "sizeCode", header: "Beden Kodu" },
  { accessorKey: "sizeText", header: "Beden" },
];
