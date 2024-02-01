import { ColumnDef } from "@tanstack/react-table";
import { customerEntity } from "~/utils/types";

export const columns: ColumnDef<customerEntity>[] = [
  { accessorKey: "MusteriUnvani", header: "Müşteri" },
  { accessorKey: "MusteriKodu" },
];
