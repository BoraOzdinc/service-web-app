import { type ColumnDef } from "@tanstack/react-table";
import { PriceTypes } from "~/_constants";
import { type getCustomerType } from "~/utils/useCustomers";

export const columns: ColumnDef<getCustomerType>[] = [
  {
    accessorKey: "name",
    header: "İsim Soyisim",
    cell({
      row: {
        original: { name, surname },
      },
    }) {
      return <div>{`${name} ${surname}`}</div>;
    },
  },
  {
    accessorKey: "companyName",
    header: "Şirket",
    cell({
      row: {
        original: { companyName },
      },
    }) {
      return <div>{companyName ? companyName : "-"}</div>;
    },
  },
  { accessorKey: "email", header: "E-Mail" },
  { accessorKey: "phoneNumber", header: "Telefon Numarası" },
  {
    accessorKey: "priceType",
    header: "Fiyat Tipi",
    cell({
      row: {
        original: { priceType },
      },
    }) {
      return <div>{PriceTypes.find((p) => p.value === priceType)?.label}</div>;
    },
  },
];
