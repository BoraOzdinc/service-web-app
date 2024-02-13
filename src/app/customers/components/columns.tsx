import { type ColumnDef } from "@tanstack/react-table";
import { type customerEntity } from "~/utils/types";

export const columns: ColumnDef<customerEntity>[] = [
  { accessorKey: "MusteriKodu", header: "Müşteri ID" },
  { accessorKey: "MusteriUnvani", header: "Müşteri" },
  { accessorKey: "MusteriTelefon", header: "Telefon No" },
  { accessorKey: "MusteriEposta", header: "E-Mail" },
  {
    accessorKey: "GrupAdi",
    header: "Müşteri Grubu",
  },
  { accessorKey: "MusteriBayiAdi", header: "Bayi" },
  { accessorKey: "FiyatTipAdi", header: "Fiyat Tipi" },
];
