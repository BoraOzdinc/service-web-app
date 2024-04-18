"use client";
import { DataTable } from "~/app/_components/tables/generic-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { api } from "~/trpc/server";
import { columns as itemSellHistoryColumns } from "./components/itemSellListColumns";
import { Button } from "~/app/_components/ui/button";
import { useRouter } from "next/navigation";

const ItemSell = () => {
  const router = useRouter();
  const { data: itemSellHistory, isLoading } =
    api.items.getItemSellHistory.useQuery();
  return (
    <Card className="flex w-full flex-col overflow-x-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Ürün Sevk/Satış</CardTitle>
          <CardDescription>Ürün Sevk/Satış Geçmiş Listesi</CardDescription>
        </div>
        <Button
          onClick={() => {
            router.push("item-sell/new");
          }}
        >
          Yeni Ürün Sevk/Satış
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={itemSellHistoryColumns}
          data={itemSellHistory}
          isLoading={isLoading}
          datePicker={{ title: "Tarih", columnToFilter: "createDate" }}
        />
      </CardContent>
    </Card>
  );
};

export default ItemSell;
