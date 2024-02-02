"use client";
import { DataTable } from "~/app/_components/tables/generic-table";
import { columns } from "./columns";
import { type itemRes } from "~/utils/types";

const ItemsTable = ({ itemList }: { itemList: itemRes }) => {
  return (
    <DataTable
      data={itemList.Entities}
      columns={columns}
      pagination
      inputFilter={{
        columnToFilter: "UrunIsim",
        title: "Ürün İsmi",
      }}
    />
  );
};

export default ItemsTable;
