"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Loader from "~/app/_components/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { getShelfDetailsWithId } from "./components/queryFunctions";

const ShelfDetail = () => {
  const { shelfId } = useParams<{ shelfId: string }>();
  const shelfDetails = useQuery({
    queryKey: ["getShelfDetail", shelfId],
    queryFn: async () => getShelfDetailsWithId(shelfId),
  });
  const router = useRouter();
  if (shelfDetails.isLoading) {
    return <Loader />;
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{shelfDetails.data?.name}</CardTitle>
        <CardDescription>Rafınızdaki Ürünler ve Kutular</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Raftaki Kutular</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3">
            {shelfDetails.data?.ShelfBox.map((b) => {
              return (
                <Card
                  key={b.id}
                  className="cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    router.push(`/layout/${shelfId}/${b.id}`);
                  }}
                >
                  <CardHeader className="p-4">
                    <CardTitle>{b.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    Kutudaki ürün sayısı: {b.ShelfItemDetail.length}
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Raftaki Ürünler</CardTitle>
          </CardHeader>
          <CardContent>
            {shelfDetails.data?.ShelfItemDetail.map((b) => {
              return (
                <Card key={b.id}>
                  <div className="flex flex-row items-center justify-between p-2">
                    <CardDescription>{b.Item?.name}</CardDescription>
                    <CardDescription>{b.quantity}</CardDescription>
                  </div>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ShelfDetail;
