import { type ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<{
  id: string;
  name: string;
  orgId: string;
}>[] = [
  { accessorKey: "name", header: "Kategori" },
];
