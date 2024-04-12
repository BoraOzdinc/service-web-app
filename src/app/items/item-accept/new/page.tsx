"use client";
import { useDebounce } from "@uidotdev/usehooks";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import BarcodeScanner from "~/app/_components/BarcodeScanner";
import ComboBox from "~/app/_components/ComboBox";
import { useItemAccept, type ItemWithBarcode } from "~/utils/useItems";
import { Label } from "~/app/_components/ui/label";
import { Input } from "~/app/_components/ui/input";
import toast from "react-hot-toast";

const NewItemAccept = () => {
  const hydrated = useHydrated();
  const { data: session } = useSession();
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
      orgId: session?.user.orgId,
      dealerId: session?.user.dealerId,
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
    item: ItemWithBarcode,
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
              await itemAccept.mutateAsync({
                fromCustomerId: selectedCustomerId,
                storageId: selectedStorageId,
                items: addedItems.map((i) => {
                  return {
                    barcode: i.barcode,
                    itemId: i.item ? i.item.id : "",
                    quantity: i.quantity,
                  };
                }),
              });
              if (itemAccept.isSuccess) {
                setAddedItem([]);
              }
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

const ItemCard = ({
  item,
  barcode,
  onUpdateItem,
  onDeleteItem,
}: {
  barcode?: {
    id: string;
    barcode: string;
    unit: string;
    isMaster: boolean;
    quantity: number;
    itemId: string;
  };
  item: {
    item: ItemWithBarcode;
    barcode: string;
    quantity: number;
  };
  onUpdateItem: (
    item: ItemWithBarcode,
    barcode: string,
    quantity: number,
    conflict: boolean,
  ) => void;
  onDeleteItem: (barcode: string) => void;
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  if (item.item) {
    return (
      <Dialog
        key={item.barcode}
        onOpenChange={() => {
          setQuantity(item.quantity);
        }}
      >
        <DialogTrigger asChild>
          <div className="flex cursor-pointer flex-col gap-1 rounded border p-1 transition-colors hover:bg-accent hover:text-accent-foreground">
            <div className="font-semibold">{item.item.name}</div>
            <div className="text-xs font-semibold">{`Barkod ve Birimi: ${item.barcode} - ${barcode?.unit} / ${barcode?.quantity}`}</div>
            <div className="text-xs font-semibold">{`Ürün Kodu: ${item.item.itemCode}`}</div>
            <div className="text-xs font-semibold">{`Renk: ${item.item.color.colorText}`}</div>
            <div className="text-xs font-semibold">{`Beden: ${item.item.size.sizeText}`}</div>
            <div className="text-xs font-semibold">{`Adet: ${item.quantity}`}</div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Düzenle</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">{item.item.name}</div>
            <div className=" font-semibold">{`Barkod ve Birimi: ${item.barcode} - ${barcode?.unit} / ${barcode?.quantity}`}</div>
            <div className=" font-semibold">{`Ürün Kodu: ${item.item.itemCode}`}</div>
            <div className=" font-semibold">{`Renk: ${item.item.color.colorText}`}</div>
            <div className=" font-semibold">{`Beden: ${item.item.size.sizeText}`}</div>

            <div>
              <Label>Adet</Label>
              <Input
                placeholder="Adet"
                name="update-quantity-input"
                defaultValue={String(quantity)}
                onChange={(e) => {
                  setQuantity(Number(e.target.value));
                }}
                type="number"
              />
            </div>
            <DialogClose asChild>
              <Button
                disabled={quantity === item.quantity}
                onClick={() =>
                  onUpdateItem(item.item, item.barcode, quantity, false)
                }
              >
                Kaydet
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant={"destructive"}
                onClick={() => onDeleteItem(item.barcode)}
              >
                Sil
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
};

const UpdateItemDialog = ({
  open,
  setOpen,
  item,
  addedItems,
  quantity,
  onUpdateItem,
  scannedBarcode,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: ItemWithBarcode | undefined;
  addedItems: {
    item: ItemWithBarcode;
    barcode: string;
    quantity: number;
  }[];
  quantity: number;
  onUpdateItem: (
    item: ItemWithBarcode,
    barcode: string,
    quantity: number,
    conflict: boolean,
  ) => void;
  scannedBarcode: string;
}) => {
  const existingItem = useMemo(() => {
    return addedItems.find((i) => i.barcode === scannedBarcode);
  }, [addedItems, scannedBarcode]);
  if (!existingItem) {
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {existingItem && (
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Bu Ürün Eklendi!</DialogTitle>
            <DialogDescription>
              Bu Ürün Zaten Eklendi Düzenlemek İstiyor Musun?
            </DialogDescription>
          </DialogHeader>
          <DialogDescription>{`Önceki Miktar: ${existingItem.quantity}`}</DialogDescription>
          <DialogDescription>{`Şimdiki Miktar: ${quantity}`}</DialogDescription>
          <DialogDescription>{`Toplam Miktar: ${
            existingItem.quantity + quantity
          }`}</DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>İptal</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={() => {
                  if (item) {
                    onUpdateItem(item, scannedBarcode, quantity, true);
                  }
                }}
              >
                Kaydet
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

const AddItemDialog = ({
  item,
  open,
  setOpen,
  isLoading,
  barcode,
  onAddItem,
}: {
  item: ItemWithBarcode | undefined;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  barcode: string;
  onAddItem: (item: ItemWithBarcode, quantity: number) => void;
}) => {
  const itemBarcode = item?.itemBarcode.find((b) => b.barcode === barcode);
  const [quantity, setQuantity] = useState(1);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex flex-row items-center gap-2">
          {isLoading && <Loader2 className="h-6 w-6 animate-spin" />}
          <DialogTitle>Ürün Ekle</DialogTitle>
        </DialogHeader>
        {item ? (
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            <div>
              <div>{`Ürün: ${item.name}`} </div>
              <div>{`Ürün Kodu: ${item.itemCode}`} </div>
              <div>{`Ürün Rengi: ${item.color.colorText}`} </div>
              <div>{`Ürün Bedeni: ${item.size.sizeText}`} </div>
            </div>
            <div>
              <div>{`Barkod: ${itemBarcode?.barcode}`}</div>
              <div>{`Barkod Birim ve Adeti: ${itemBarcode?.unit}, ${itemBarcode?.quantity}`}</div>
            </div>
          </div>
        ) : (
          <div>Ürün Bulunamadı</div>
        )}
        <div>
          <Label>Adet</Label>
          <Input
            type="number"
            disabled={!item}
            value={quantity}
            onChange={(e) => {
              setQuantity(Number(e.target.value));
            }}
          />
        </div>
        <Button
          disabled={isLoading || !item}
          onClick={() => {
            if (item) {
              onAddItem(item, quantity);
            }
          }}
        >
          Ekle
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            setOpen(false);
          }}
        >
          İptal
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NewItemAccept;
