"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { Button } from "../_components/ui/button";
import Link from "next/link";
import { api } from "~/trpc/server";
import Loader from "../_components/loader";
import { columns } from "./components/columns";
import { DataTable } from "../_components/tables/generic-table";
import { useRouter } from "next/navigation";

const Items = () => {
  const ItemsData = api.items.getItems.useQuery();

  const router = useRouter();
  if (ItemsData.isLoading) {
    return <Loader />;
  }

  return (
    <Card className="flex w-full flex-col overflow-x-auto">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Ürün Listesi</CardTitle>
        <Link href={"/items/new-item"}>
          <Button>Yeni ürün ekle</Button>
        </Link>
      </CardHeader>
      <CardContent className=" w-full">
        {ItemsData.data && (
          <DataTable
            data={ItemsData.data}
            columns={columns}
            pagination
            inputFilter={{
              columnToFilter: "name",
              title: "Ürün İsmi",
            }}
            onRowClick={(row) => router.push(`items/${row.original.id}}`)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Items;
