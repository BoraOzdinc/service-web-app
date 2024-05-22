"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import { type getStoragesType } from "./queryFunctions";
import { Loader2, Trash2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { useEffect, useState } from "react";
import Shelf from "./Shelf";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { Input } from "~/app/_components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ScrollArea } from "~/app/_components/ui/scroll-area";
import { api } from "~/trpc/server";
import {
  useCreateQrCodes,
  useCreateShelf,
  useDeleteShelf,
} from "~/utils/useStorage";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";

const ShelfCard = ({ storages }: { storages: getStoragesType }) => {
  const searchParams = useSearchParams();

  const search = searchParams.get("q");
  const [selectedStorageID, setSelectedStorageID] = useState("");
  const [shelfName, setShelfName] = useState("");

  const shelfData = api.storage.getStorageLayoutItems.useQuery(
    { storageId: selectedStorageID },
    { enabled: !!selectedStorageID.length },
  );
  const generateQr = useCreateQrCodes();
  const addShelf = useCreateShelf();
  const deleteShelf = useDeleteShelf();
  useEffect(() => {
    if (storages.storages) {
      setSelectedStorageID(search ?? "");
    }
  }, [search, storages]);
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-col gap-2">
          <CardTitle>Depo Düzeni</CardTitle>
          <div className="flex items-center gap-2">
            <Select
              onValueChange={setSelectedStorageID}
              value={selectedStorageID}
              disabled={storages.isLoading}
            >
              <SelectTrigger className="max-w-[180px]">
                <SelectValue placeholder="Depo Seçin..." />
              </SelectTrigger>
              <SelectContent>
                {storages.storages?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={!selectedStorageID || shelfData.isLoading}>
                Rafları Düzenle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rafları Düzenle</DialogTitle>
              </DialogHeader>
              <ScrollArea className=" max-h-[200px] w-full rounded border p-2">
                {shelfData.data?.length ? (
                  shelfData.data?.map((s) => {
                    return (
                      <div
                        key={s.id}
                        className="mt-1 flex flex-row items-center justify-between"
                      >
                        <p>{s.name}</p>
                        <Button
                          variant={"destructive"}
                          className=""
                          disabled={deleteShelf.isLoading}
                          onClick={() => {
                            deleteShelf.mutate({ shelfId: s.id });
                          }}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <p>Raf Bulunamadı</p>
                )}
              </ScrollArea>
              <div>
                <Label>Raf İsmi</Label>
                <Input
                  value={shelfName}
                  onChange={(e) => {
                    setShelfName(e.target.value);
                  }}
                />
              </div>
              <Button
                disabled={!shelfName.length}
                onClick={() => {
                  if (selectedStorageID.length && shelfName.length) {
                    addShelf.mutate({
                      name: shelfName,
                      storageId: selectedStorageID,
                    });
                  }
                }}
              >
                Raf Ekle
              </Button>
            </DialogContent>
          </Dialog>
          <Button
            disabled={!selectedStorageID}
            isLoading={generateQr.isLoading}
            onClick={() => {
              generateQr.mutate(
                {
                  storageId: selectedStorageID,
                },
                {
                  async onSuccess(qrCodes) {
                    if (!qrCodes) {
                      return;
                    }
                    const doc = new jsPDF();
                    const margin = 10;
                    let xOffset = margin;
                    let yOffset = margin;
                    const qrSize = 50;
                    const boxSize = 30;
                    const padding = 10;
                    const fontSize = 15;

                    qrCodes.forEach(({ qrLink, boxes, name: shelfName }) => {
                      const shelfHeight =
                        qrSize +
                        padding +
                        Math.ceil(boxes.length / 2) * (boxSize + padding);

                      if (
                        yOffset + shelfHeight >
                        doc.internal.pageSize.getHeight()
                      ) {
                        doc.addPage();
                        yOffset = margin;
                        xOffset = margin;
                      }
                      // Add shelf QR code and name
                      doc.addImage(
                        qrLink,
                        "PNG",
                        xOffset,
                        yOffset,
                        qrSize,
                        qrSize,
                      );
                      doc.setFontSize(fontSize);
                      doc.text(shelfName ?? "-", xOffset, yOffset + qrSize + 5); // Add shelf name below QR code
                      yOffset += qrSize + padding + fontSize + 5; // Update yOffset including text height

                      let boxXOffset = xOffset;
                      boxes.forEach(({ qrLink, name: boxName }, j) => {
                        doc.addImage(
                          qrLink,
                          "PNG",
                          boxXOffset,
                          yOffset,
                          boxSize,
                          boxSize,
                        );

                        // Add box name below QR code
                        doc.setFontSize(fontSize);
                        doc.text(
                          boxName ?? "-",
                          boxXOffset,
                          yOffset + boxSize + 5,
                        );

                        if ((j + 1) % 2 === 0) {
                          yOffset += boxSize + padding + fontSize + 5; // Update yOffset including text height
                          boxXOffset = xOffset;
                        } else {
                          boxXOffset += boxSize + padding;
                        }
                      });

                      yOffset = Math.max(yOffset, yOffset + boxSize + padding);
                    });

                    doc.save("qr_codes.pdf");
                  },
                },
              );
            }}
          >
            Kare Kodları Oluştur
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <CardTitle>Raflar</CardTitle>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {selectedStorageID && shelfData.isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            shelfData.data?.map((s) => {
              return <Shelf key={s.id} data={s} />;
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShelfCard;
