import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { Button } from "../_components/ui/button";
import Link from "next/link";
import StorageDialog from "./components/StorageDialog";
import MainItemsList from "./components/ItemsListComponent";
import { getItems, getStorages } from "./components/queryFunctions";

const Items = async () => {
  const itemsData = await getItems(undefined, undefined);
  const storagesData = await getStorages();
  return (
    <Card className="flex w-full flex-col overflow-x-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ürün Listesi</CardTitle>
        <div className=" flex gap-3">
          <StorageDialog storages={storagesData} />
          <Link href={"/items/new-item"}>
            <Button>Yeni ürün ekle</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className=" w-full">
        <MainItemsList data={itemsData} />
      </CardContent>
    </Card>
  );
};


export default Items;
