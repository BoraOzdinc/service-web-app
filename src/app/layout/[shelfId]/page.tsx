"use client";
import { useParams, useRouter } from "next/navigation";
import Loader from "~/app/_components/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import Link from "next/link";
import { CircleArrowLeftIcon, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { Button } from "~/app/_components/ui/button";
import { ScrollArea } from "~/app/_components/ui/scroll-area";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "~/app/_components/ui/input";
import { useState } from "react";
import { api } from "~/trpc/server";
import { useCreateShelfBox } from "~/utils/useStorage";

const ShelfDetail = () => {
  const { shelfId } = useParams<{ shelfId: string }>();
  const [boxName, setBoxName] = useState("");
  const shelfDetails = api.storage.getShelfDetailsWithId.useQuery({ shelfId });
  const addBox = useCreateShelfBox();
  const router = useRouter();
  if (shelfDetails.isLoading) {
    return <Loader />;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-1 space-y-0">
        <Link href={`/layout?q=${shelfDetails.data?.Storage?.id}`}>
          <CircleArrowLeftIcon />
        </Link>
        <CardTitle className="mt-0">{shelfDetails.data?.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Raftaki Kutular</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Kutuları Düzenle</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Kutuları Düzenle</DialogTitle>
                </DialogHeader>
                <ScrollArea className=" max-h-[200px] w-full rounded border p-2">
                  {shelfDetails.data?.ShelfBox.length ? (
                    shelfDetails.data?.ShelfBox.map((s) => {
                      return (
                        <div
                          key={s.id}
                          className="mt-1 flex flex-row items-center justify-between"
                        >
                          <p>{s.name}</p>
                          <Button
                            variant={"destructive"}
                            /* disabled={deleteShelf.isLoading}
                            onClick={() => {
                              deleteShelf.mutate({ shelfId: s.id });
                            }} */
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })
                  ) : (
                    <p>Kutu Bulunamadı</p>
                  )}
                </ScrollArea>
                <div>
                  <Label>Kutu İsmi</Label>
                  <Input
                    value={boxName}
                    onChange={(e) => {
                      setBoxName(e.target.value);
                    }}
                  />
                </div>
                <Button
                  disabled={!boxName.length || addBox.isLoading}
                  isLoading={addBox.isLoading}
                  onClick={() => {
                    if (boxName.length && shelfDetails.data?.Storage?.id) {
                      addBox.mutate({
                        name: boxName,
                        storageId: shelfDetails.data.Storage.id,
                        shelfId,
                      });
                    }
                  }}
                >
                  Raf Ekle
                </Button>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-3">
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
