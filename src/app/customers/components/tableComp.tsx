"use client";
import { DataTable } from "~/app/_components/tables/generic-table";
import { columns } from "./columns";
import { type customerRes } from "~/utils/types";

const CustomerTable = ({ customerList }: { customerList: customerRes }) => {
  return (
    <DataTable
      data={customerList.Entities}
      columns={columns}
      pagination
      inputFilter={{
        columnToFilter: "MusteriUnvani",
        title: "Müşteri İsmi",
      }}
    />
  );
};

export default CustomerTable;
