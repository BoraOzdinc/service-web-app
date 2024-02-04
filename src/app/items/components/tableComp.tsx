"use client";
import { DataTable } from "~/app/_components/tables/generic-table";
import { columns } from "./columns";
import { type Item } from "~/utils/useItems";

const ItemsTable = ({ itemList }: { itemList: Item[] }) => {
  return (
    <DataTable
      data={itemList}
      columns={columns}
      pagination
      inputFilter={{
        columnToFilter: "name",
        title: "Ürün İsmi",
      }}
    />
  );
};

export default ItemsTable;
