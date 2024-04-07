import Link from "next/link";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { type RouterOutputs } from "~/trpc/shared";

const DealerCard = ({
  dealerData,
}: {
  dealerData: RouterOutputs["dealer"]["getDealers"][number];
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{dealerData.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{`Bayii'nin toplam üye sayısı: ${dealerData.members.length}`}</p>
        <p>{`Bayii'nin deposundaki toplam ürün sayısı: ${dealerData.items.length}`}</p>
        <p>Toplam Satış (WIP)</p>
      </CardContent>
      <CardFooter className="">
        <Link href={`/settings/dealers/${dealerData.id}`}>
          <Button className="w-full" variant={"outline"}>
            Detaylar
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default DealerCard;
