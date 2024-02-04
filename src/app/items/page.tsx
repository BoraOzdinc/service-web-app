"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import ItemsTable from "./components/tableComp";
import { Button } from "../_components/ui/button";
import Link from "next/link";
import { api } from "~/trpc/server";

const Items = () => {
  const ItemsData = api.items.getItems.useQuery();
  return (
    <Card className="flex  w-screen flex-col">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Ürün Listesi</CardTitle>
        <Link href={"/items/new-item"}>
          <Button>Yeni ürün ekle</Button>
        </Link>
      </CardHeader>
      <CardContent className=" w-full">
        {ItemsData.isLoading && <p>Yükleniyor</p>}
        {ItemsData.data && <ItemsTable itemList={ItemsData.data} />}
      </CardContent>
    </Card>
  );
};

export default Items;
