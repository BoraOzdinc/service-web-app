import { type ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { type ItemHistory } from "~/utils/useItems";

export const columns: ColumnDef<{
  id: string;
  barcode: string;
  unit: string;
  isMaster: boolean;
  quantity: number;
  itemId: string;
}>[] = [
  { accessorKey: "barcode", header: "Barkod" },
  { accessorKey: "unit", header: "Birim" },
  {
    accessorKey: "quantity",
    header: "Adet",
  },
  {
    accessorKey: "isMaster",
    header: "Ana Barkod",
    cell: ({
      row: {
        original: { isMaster },
      },
    }) => {
      if (!isMaster) {
        return <XCircleIcon />;
      }
      return <CheckCircle2Icon />;
    },
  },
];
