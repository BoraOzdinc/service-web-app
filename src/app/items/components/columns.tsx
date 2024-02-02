import { ColumnDef } from "@tanstack/react-table";
import { customerEntity, itemEntity } from "~/utils/types";

export const columns: ColumnDef<itemEntity>[] = [
  { accessorKey: "UrunKodu", header: "Ürün Kodu" },
  { accessorKey: "Barkodu", header: "Barkod" },
  { accessorKey: "UrunIsim", header: "Ürün İsmi" },
  { accessorKey: "AnaGrupAdi", header: "Ana Grup" },
  { accessorKey: "KategoriAdi", header: "Kategori" },
  { accessorKey: "MarkaAdi", header: "Marka" },
  { accessorKey: "ToplamStok", header: "Toplam Stok" },
  { accessorKey: "UrunSatisFiyati", header: "Satış Fiyat" },
  {
    accessorKey: "UrunSonAlisFiyati",
    header: "Son Alış Fiyat",
  },
  { accessorKey: "TedarikciUnvani", header: "Tedarikçi" },
];
