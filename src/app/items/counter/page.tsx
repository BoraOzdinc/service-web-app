"use client";
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
  DialogTrigger,
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
import { useItemCount, type ItemWithBarcode } from "~/utils/useItems";
import AddItemDialog from "../item-accept/components/AddItemDialog";
import UpdateItemDialog from "../item-accept/components/UpdateItemDialog";
import ItemCard from "../item-accept/components/ItemCard";
import { ScrollArea } from "~/app/_components/ui/scroll-area";
import { DataTable } from "~/app/_components/tables/generic-table";
import { type ColumnDef } from "@tanstack/react-table";

const ItemCount = () => {
  const storages = api.items.getStorages.useQuery({});
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
      quantity: number;
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
          quantity: quantity,
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

  const onUpdateItem = (
    barcode: string,
    quantity: number,
    conflict: boolean,
  ) => {
    const existingItem = addedItems.find((i) => i.barcode === barcode);
    const itemIndex = addedItems.findIndex((i) => i.barcode === barcode);

    if (existingItem) {
      setAddedItem((prevItems) => {
        const newItems = [...prevItems];
        const itemBarcode = existingItem.item?.itemBarcode.find(
          (b) => b.barcode === scannedBarcode,
        );
        if (conflict) {
          newItems[itemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + quantity,
            totalAdded:
              existingItem.totalAdded + (itemBarcode?.quantity ?? 1) * quantity,
          };
        } else {
          newItems[itemIndex] = {
            ...existingItem,
            quantity: quantity,
            totalAdded: (itemBarcode?.quantity ?? 1) * quantity,
          };
        }
        return newItems;
      });
    }
    toast.success("Güncellendi");
    setIsUpdateItemOpen(false);
    setIsAddItemOpen(false);
  };
  const onDeleteItem = (barcode: string) => {
    const itemIndex = addedItems.findIndex((i) => i.barcode === barcode);

    setAddedItem((prevItems) => {
      const newItems = [...prevItems];
      newItems.splice(itemIndex, 1);
      return newItems;
    });

    toast.success("Silindi");
    setIsUpdateItemOpen(false);
    setIsAddItemOpen(false);
  };
  const countItems = useItemCount();
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
        <Dialog>
          <DialogTrigger asChild>
            <Button>Tamamla</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Özet</DialogTitle>
              <DialogDescription>Ürün Sayımınızın Özeti</DialogDescription>
              <DialogDescription>
                Not: Ürün Sayımı Bütün Deponuzdaki Stokları Aşşağıdaki Stoklar
                ile Güncelleyecek!
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[300px] rounded border p-1">
              <DataTable data={addedItems} columns={CountDealerColumns} />
            </ScrollArea>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    countItems.mutate(
                      {
                        storageId: selectedStorage?.id ?? "",
                        items: addedItems.map((i) => ({
                          itemId: i.item?.id ?? "",
                          barcode: i.barcode,
                          totalAdded: i.totalAdded,
                        })),
                      },
                      {
                        onSuccess: () => {
                          setAddedItem([]);
                        },
                      },
                    );
                  }}
                >
                  Kaydet
                </Button>
              </DialogClose>

              <DialogClose asChild>
                <Button variant={"outline"}>Vazgeç</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <AddItemDialog
          item={ItemsData.data}
          open={isAddItemOpen}
          setOpen={setIsAddItemOpen}
          isLoading={ItemsData.isLoading}
          barcode={scannedBarcode}
          onAddItem={onAddItem}
        />
        <UpdateItemDialog
          open={isUpdateItemOpen}
          setOpen={setIsUpdateItemOpen}
          item={ItemsData.data}
          addedItems={addedItems}
          quantity={updateQuantity}
          onUpdateItem={onUpdateItem}
          scannedBarcode={scannedBarcode}
        />
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
                  setSelectedStorage(
                    storages.data?.find((s) => s.id === value) as
                      | {
                          id: string;
                          name: string;
                          orgId: string | null;
                          dealerId: string | null;
                        }
                      | undefined,
                  )
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
        {addedItems.length ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
            {addedItems.map((item) => {
              if (item.item) {
                const barcode = item.item.itemBarcode.find(
                  (b) => b.barcode === item.barcode,
                );
                return (
                  <ItemCard
                    key={barcode?.id}
                    item={item}
                    barcode={barcode}
                    onUpdateItem={onUpdateItem}
                    onDeleteItem={onDeleteItem}
                  />
                );
              }
            })}
          </div>
        ) : (
          <div className="text-xl" key={"empty"}>
            Henüz Ürün Eklenmedi! Barkod Tuşuna Basarak Ürün Eklemeye
            Başlayabilirsiniz
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CountDealerColumns: ColumnDef<{
  item: ItemWithBarcode;
  barcode: string;
  quantity: number;
  totalAdded: number;
}>[] = [
  {
    accessorKey: "item",
    header: "Ürün Adı",
    cell({
      row: {
        original: { item },
      },
    }) {
      return item?.name;
    },
  },
  {
    accessorKey: "barcode",
    header: "Barkod",
  },
  {
    accessorKey: "totalAdded",
    header: "Toplam Adet",
  },
];

export default ItemCount;
