import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { type getStorageLayoutItemsType } from "./queryFunctions";

type ShelfData = NonNullable<getStorageLayoutItemsType>[number];

const Shelf = ({ data }: { data: ShelfData }) => {
  const router = useRouter();
  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
      onClick={() => {
        console.log("click");

        router.push(`/layout/${data.id}`);
      }}
    >
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Raftaki Kutu Sayısı: {data.ShelfBox.length}</p>
        <p>Raftaki Ürün Sayısı: {data.ShelfItemDetail.length}</p>
      </CardContent>
    </Card>
  );
};

export default Shelf;
