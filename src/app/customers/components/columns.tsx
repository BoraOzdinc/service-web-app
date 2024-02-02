import { ColumnDef } from "@tanstack/react-table";
import { customerEntity } from "~/utils/types";

export const columns: ColumnDef<customerEntity>[] = [
  { accessorKey: "MusteriKodu", header: "Müşteri ID" },
  { accessorKey: "MusteriUnvani", header: "Müşteri" },
  { accessorKey: "MusteriTelefon", header: "Telefon No" },
  { accessorKey: "MusteriEposta", header: "E-Mail" },
  {
    accessorKey: "GrupAdi",
    header: "Müşteri Grubu",
    filterFn: (row, id, value) => {
      return false;
    },
  },
  { accessorKey: "MusteriBayiAdi", header: "Bayi" },
  { accessorKey: "FiyatTipAdi", header: "Fiyat Tipi" },
];
