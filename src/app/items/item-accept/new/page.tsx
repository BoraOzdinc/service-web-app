"use client";
import { useDebounce } from "@uidotdev/usehooks";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
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
import BarcodeScanner from "~/app/_components/BarcodeScanner";
import ComboBox from "~/app/_components/ComboBox";
import { useItemAccept, type ItemWithBarcode } from "~/utils/useItems";
import toast from "react-hot-toast";
import AddItemDialog from "../components/AddItemDialog";
import UpdateItemDialog from "../components/UpdateItemDialog";
import ItemCard from "../components/ItemCard";

const NewItemAccept = () => {
  const hydrated = useHydrated();
  const { data: session } = api.utilRouter.getSession.useQuery();
  const [selectedStorageId, setSelectedStorageId] = useState<
    string | undefined
  >();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const debouncedStorageId = useDebounce(selectedStorageId, 100);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isStorageOpen, setIsStorageOpen] = useState(true);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isUpdateItemOpen, setIsUpdateItemOpen] = useState(false);
  const [updateQuantity, setUpdateQuantity] = useState(1);
  const itemAccept = useItemAccept();
  const [data, setData] = useState("");
  const storages = api.items.getStorages.useQuery();
  const customers = api.customer.getCustomers.useQuery();
  const [addedItems, setAddedItem] = useState<
    { item: ItemWithBarcode; barcode: string; quantity: number }[]
  >([]);
  const ItemsData = api.items.getItemWithBarcode.useQuery(
    {
      orgId: session?.orgId ?? undefined,
      dealerId: session?.dealerId ?? undefined,
      barcode: data,
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
        Boolean(selectedStorageId) &&
        Boolean(session) &&
        !!data,
    },
  );

  useEffect(() => {
    if (ItemsData.isFetching) {
      setIsAddItemOpen(true);
    }
  }, [ItemsData.isFetching]);

  const onAddItem = (item: ItemWithBarcode, quantity: number) => {
    const existingItem = addedItems.find((i) => i.barcode === data);

    if (!existingItem) {
      setAddedItem([...addedItems, { item, barcode: data, quantity }]);
    } else {
      setUpdateQuantity(quantity);
      setIsUpdateItemOpen(true);
    }
    toast.success("Eklendi");
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
        if (conflict) {
          newItems[itemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + quantity,
          };
        } else {
          newItems[itemIndex] = {
            ...existingItem,
            quantity: quantity,
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

  if (!hydrated) {
    return null;
  }
  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="flex flex-row items-center gap-3">
        <CardTitle>Yeni Ürün Kabul</CardTitle>
        <BarcodeScanner
          setData={setData}
          open={isBarcodeOpen}
          setOpen={setIsBarcodeOpen}
        />
        <Button
          disabled={!addedItems.length}
          onClick={async () => {
            if (addedItems && selectedCustomerId && selectedStorageId) {
              await itemAccept.mutateAsync(
                {
                  fromCustomerId: selectedCustomerId,
                  storageId: selectedStorageId,
                  items: addedItems.map((i) => {
                    return {
                      barcode: i.barcode,
                      itemId: i.item ? i.item.id : "",
                      quantity: i.quantity,
                    };
                  }),
                },
                {
                  onSuccess: () => {
                    setAddedItem([]);
                  },
                },
              );
            }
          }}
        >
          Kaydet
        </Button>
      </CardHeader>

      <Dialog defaultOpen open={isStorageOpen} onOpenChange={setIsStorageOpen}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Ürün Kabul</DialogTitle>
            <DialogDescription>
              Ürün Kabul için Depo ve Müşteri Seçin.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            {storages.isLoading && (
              <Loader2 className="h-10 w-10 animate-spin" />
            )}
            <Select
              onValueChange={(value) => setSelectedStorageId(value)}
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
            <ComboBox
              data={customers.data?.map((d) => {
                const label = d.companyName
                  ? `${d.companyName} ${d.name} ${d.surname}`
                  : `${d.name} ${d.surname}`;
                return {
                  label: label,
                  value: d.id,
                };
              })}
              name="customer_select"
              onChange={(e) => setSelectedCustomerId(e as string)}
              value={selectedCustomerId}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                disabled={
                  debouncedStorageId !== selectedStorageId ||
                  !selectedStorageId ||
                  !selectedCustomerId
                }
              >
                Kaydet
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CardContent className=" w-full overflow-scroll sm:overflow-auto">
        <AddItemDialog
          item={ItemsData.data}
          open={isAddItemOpen}
          setOpen={setIsAddItemOpen}
          isLoading={ItemsData.isLoading}
          barcode={data}
          onAddItem={onAddItem}
        />
        <UpdateItemDialog
          open={isUpdateItemOpen}
          setOpen={setIsUpdateItemOpen}
          item={ItemsData.data}
          addedItems={addedItems}
          quantity={updateQuantity}
          onUpdateItem={onUpdateItem}
          scannedBarcode={data}
        />

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

export default NewItemAccept;
