"use client";
import Loader from "~/app/_components/loader";
import { api } from "~/trpc/server";
import DealerCard from "./components/DealerCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { Button } from "~/app/_components/ui/button";

const Dealers = () => {
  const { data: dealers, isLoading: dealersLoading } =
    api.dealer.getDealers.useQuery(undefined, { retry: false });

  if (dealersLoading || !dealers) {
    return <Loader />;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Bayiileriniz</CardTitle>
          <CardDescription>Yönetmek istediğiniz bayii seçin</CardDescription>
        </div>
        <Button>Yeni Bayii Oluştur</Button>
      </CardHeader>
      <CardContent className="grid w-full grid-cols-1 gap-3 md:grid-cols-3">
        {dealers.map((d) => {
          return <DealerCard key={d.id} dealerData={d} />;
        })}
      </CardContent>
    </Card>
  );
};

export default Dealers;
