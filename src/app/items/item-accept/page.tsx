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

const ItemAccept = () => {
  //const itemAccept = useItemAccept();
  const { data: itemAcceptHistory } = api.items.getItemAcceptHistory.useQuery();
  return (
    <Card className="flex w-full flex-col">
      <CardHeader>
        <CardTitle>Ürün Kabul</CardTitle>
        <CardDescription>Ürün Kabul Geçmiş Listesi</CardDescription>
      </CardHeader>
      <CardContent>
        {itemAcceptHistory ? (
          <DataTable
            columns={itemAcceptHistoryColumns}
            data={itemAcceptHistory}
            datePicker={{ title: "Tarih", columnToFilter: "createDate" }}
          />
        ) : null}
        {/* <Button
          onClick={() => {
            itemAccept.mutate({
              storageId: "66094a2ddf148de746eb48b0",
              items: [
                { itemId: "6609c21f2933c908d501fdd9", quantity: 3 },
                { itemId: "6609c2ed2933c908d501fddc", quantity: 2 },
              ],
            });
          }}
        >
          Test Kabul
        </Button> */}
      </CardContent>
    </Card>
  );
};

export default ItemAccept;
