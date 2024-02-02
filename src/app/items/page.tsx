import { fetchItems } from "~/utils/fetchReqs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import ItemsTable from "./components/tableComp";

const Items = async () => {
  const ItemsData = await fetchItems();

  return (
    <Card className="flex  w-screen flex-col">
      <CardHeader>
        <CardTitle>Ürün Listesi</CardTitle>
      </CardHeader>
      <CardContent className=" w-full">
        {ItemsData && <ItemsTable itemList={ItemsData} />}
      </CardContent>
    </Card>
  );
};

export default Items;
