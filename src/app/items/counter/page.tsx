"use client";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BarcodeScanner from "~/app/_components/BarcodeScanner";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/app/_components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import { useHydrated } from "~/trpc/react";
import { api } from "~/trpc/server";
import {type ItemWithBarcode } from "~/utils/useItems";

const ItemCount = () => {
  const storages = api.items.getStorages.useQuery();
  const { data: session } = api.utilRouter.getSession.useQuery();
  const hydrated = useHydrated();
  const [isStorageOpen, setIsStorageOpen] = useState(true);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string>("");
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [updateQuantity, setUpdateQuantity] = useState(1);
  const [isUpdateItemOpen, setIsUpdateItemOpen] = useState(false);

  const [selectedStorage, setSelectedStorage] = useState<{
    id: string;
    name: string;
    orgId: string | null;
    dealerId: string | null;
  }>();
  const debouncedStorage = useDebounce(selectedStorage?.id, 100);

  const ItemsData = api.items.getItemWithBarcode.useQuery(
    {
      orgId: session?.orgId ?? undefined,
      dealerId: session?.dealerId ?? undefined,
      barcode: scannedBarcode,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchOnMount: false,
      retry: false,
      enabled:
        !isStorageOpen &&
        !isBarcodeOpen &&
        Boolean(selectedStorage?.id) &&
        Boolean(session) &&
        !!scannedBarcode,
    },
  );
  const [addedItems, setAddedItem] = useState<
    {
      item: ItemWithBarcode;
      barcode: string;
      totalAdded: number;
    }[]
  >([]);

  useEffect(() => {
    if (ItemsData.isFetching) {
      setIsAddItemOpen(true);
    }
  }, [ItemsData.isFetching]);

  const onAddItem = (item: ItemWithBarcode, quantity: number) => {
    const existingItem = addedItems.find((i) => i.barcode === scannedBarcode);
    if (!existingItem) {
      const itemBarcode = item?.itemBarcode.find(
        (b) => b.barcode === scannedBarcode,
      );
      setAddedItem([
        ...addedItems,
        {
          item,
          barcode: scannedBarcode,
          totalAdded: (itemBarcode?.quantity ?? 1) * quantity,
        },
      ]);
      toast.success("Eklendi");
    } else {
      setUpdateQuantity(quantity);
      setIsUpdateItemOpen(true);
    }
    setIsAddItemOpen(false);
  };

  if (!hydrated) {
    return null;
  }
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-3">
        <div>
          <CardTitle>Ürün Sayımı</CardTitle>
          {selectedStorage?.id && (
            <CardDescription>{`Seçilen Depo: ${selectedStorage?.name}`}</CardDescription>
          )}
        </div>
        <BarcodeScanner
          setOpen={setIsBarcodeOpen}
          open={isBarcodeOpen}
          setData={setScannedBarcode}
        />
      </CardHeader>
      <CardContent>
        <Dialog
          defaultOpen
          open={isStorageOpen}
          onOpenChange={setIsStorageOpen}
        >
          <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader className="flex flex-row items-center gap-3">
              <div>
                <DialogTitle>Ürün Sayımı</DialogTitle>
                <DialogDescription>
                  Ürün sayımı için depo seçin.
                </DialogDescription>
              </div>
              {storages.isLoading && (
                <Loader2 className="h-8 w-8 animate-spin" />
              )}
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Select
                onValueChange={(value) =>
                  setSelectedStorage(storages.data?.find((s) => s.id === value))
                }
                disabled={!storages.data}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Depo" />
                </SelectTrigger>
                <SelectContent>
                  {storages.data?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  disabled={
                    debouncedStorage !== selectedStorage?.id ||
                    !selectedStorage?.id
                  }
                >
                  Kaydet
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ItemCount;
