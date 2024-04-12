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
//import { useItemAccept } from "~/utils/useItems";
import { columns as itemAcceptHistoryColumns } from "./components/itemAcceptListColumns";
import { Button } from "~/app/_components/ui/button";
import { useRouter } from "next/navigation";

const ItemAccept = () => {
  //const itemAccept = useItemAccept();
  const router = useRouter();
  const { data: itemAcceptHistory, isLoading } =
    api.items.getItemAcceptHistory.useQuery();
  return (
    <Card className="flex w-full flex-col overflow-x-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Ürün Kabul</CardTitle>
          <CardDescription>Ürün Kabul Geçmiş Listesi</CardDescription>
        </div>
        <Button
          onClick={() => {
            router.push("item-accept/new");
          }}
        >
          Yeni Ürün Kabul
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={itemAcceptHistoryColumns}
          data={itemAcceptHistory}
          isLoading={isLoading}
          datePicker={{ title: "Tarih", columnToFilter: "createDate" }}
        />
      </CardContent>
    </Card>
  );
};

export default ItemAccept;
