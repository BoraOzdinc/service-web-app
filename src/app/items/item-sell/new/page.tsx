"use client";
import { useDebounce } from "@uidotdev/usehooks";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import BarcodeScanner from "~/app/_components/BarcodeScanner";
import ComboBox from "~/app/_components/ComboBox";
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
import { useItemSell, type ItemWithBarcode } from "~/utils/useItems";
import ItemCard from "../../item-accept/components/ItemCard";
import UpdateItemDialog from "../../item-accept/components/UpdateItemDialog";
import AddItemDialog from "../components/AddItemDialog";
import { PriceTypes } from "~/_constants";
import { $Enums } from "@prisma/client";
import { Checkbox } from "~/app/_components/ui/checkbox";
import { Label } from "~/app/_components/ui/label";
import { DataTable } from "~/app/_components/tables/generic-table";
import { columns as summaryColumns } from "./components/columns";
import { Input } from "~/app/_components/ui/input";

const NewItemSell = () => {
  const hydrated = useHydrated();
  const { data: session } = useSession();
  const storages = api.items.getStorages.useQuery();
  const customers = api.customer.getCustomers.useQuery();
  const [selectedStorageId, setSelectedStorageId] = useState<
    string | undefined
  >();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedPriceType, setSelectedPriceType] = useState<
    $Enums.PriceType | undefined
  >();
  const euroPrice = api.utilRouter.getEuroPrice.useQuery(undefined, {
    refetchInterval: 30000,
  });
  useEffect(() => {
    const type = customers.data?.find((c) => c.id === selectedCustomerId)
      ?.priceType;
    setSelectedPriceType(type);
  }, [customers.data, selectedCustomerId]);

  const dealerPriceType = useMemo(() => {
    const type = customers.data?.find((c) => c.id === selectedCustomerId)
      ?.connectedDealer?.priceType;
    setSelectedPriceType(type);
    return type;
  }, [customers.data, selectedCustomerId]);

  const debouncedStorageId = useDebounce(selectedStorageId, 100);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isStorageOpen, setIsStorageOpen] = useState(true);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isUpdateItemOpen, setIsUpdateItemOpen] = useState(false);
  const [isTransferToDealerChecked, setIsTransferToDealerChecked] =
    useState(true);
  const [updateQuantity, setUpdateQuantity] = useState(1);
  //!const itemAccept = useItemAccept();
  const [data, setData] = useState("");

  const [addedItems, setAddedItem] = useState<
    {
      item: ItemWithBarcode;
      barcode: string;
      quantity: number;
      totalAdded: number;
    }[]
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
      const itemBarcode = item?.itemBarcode.find((b) => b.barcode === data);
      setAddedItem([
        ...addedItems,
        {
          item,
          barcode: data,
          quantity,
          totalAdded: (itemBarcode?.quantity ?? 1) * quantity,
        },
      ]);
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
        const itemBarcode = existingItem.item?.itemBarcode.find(
          (b) => b.barcode === data,
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

  const uniqueItems = useMemo(() => {
    const itemMap = new Map<string, (typeof addedItems)[0]>();

    addedItems.forEach((curVal) => {
      const masterBarcode = curVal.item?.itemBarcode.find((b) => b.isMaster)
        ?.barcode;
      if (curVal.item?.id && !!masterBarcode) {
        const existingItem = itemMap.get(curVal.item?.id);
        if (!existingItem) {
          itemMap.set(curVal.item?.id, { ...curVal, barcode: masterBarcode });
        } else {
          existingItem.totalAdded += curVal.totalAdded;
        }
      }
    });

    return Array.from(itemMap.values());
  }, [addedItems]);

  const columns = useMemo(() => {
    return summaryColumns(selectedPriceType);
  }, [selectedPriceType]);

  const totalPayAmount = uniqueItems.reduce((acc, curVal) => {
    if (selectedPriceType) {
      const price = curVal.item?.[selectedPriceType];
      acc += curVal.totalAdded * Number(price);
    }
    return acc;
  }, 0);
  console.log(selectedPriceType);

  const [discount, setDiscount] = useState<number>(0);
  const [priceToPay, setPriceToPay] = useState<number>();
  const [priceToPayTr, setPriceToPayTr] = useState<number>();
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paidAmountTr, setPaidAmountTr] = useState<number>(0);
  const itemSell = useItemSell();
  const onSubmitSell = (saleCancel: boolean) => {
    const payload = {
      storageId: selectedStorageId ?? "",
      customerId: selectedCustomerId,
      discount: discount,
      totalPayAmount: totalPayAmount,
      priceToPay: priceToPay ?? 0,
      selectedPriceType: selectedPriceType,
      exchangeRate: euroPrice.data?.satisEkran,
      transferToDealer: isTransferToDealerChecked,
      paidAmount: paidAmount,
      saleCancel: saleCancel,
      items: uniqueItems.map((i) => ({
        itemId: i.item?.id ?? "",
        price: selectedPriceType && (i.item?.[selectedPriceType] ?? undefined),
        barcode: i.barcode,
        totalAdded: i.totalAdded,
      })),
    };
    itemSell.mutate(payload);
  };

  if (!hydrated) {
    return null;
  }
  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="flex flex-row items-center gap-3">
        <CardTitle>Yeni Ürün Sevk/Satış</CardTitle>
        <BarcodeScanner
          setData={setData}
          open={isBarcodeOpen}
          setOpen={setIsBarcodeOpen}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={!addedItems.length}>Kaydet</Button>
          </DialogTrigger>
          <DialogContent className="max-w-min overflow-scroll sm:overflow-hidden">
            <DialogHeader>
              <DialogTitle>Özet</DialogTitle>
              <DialogDescription>Satışınızın Özeti</DialogDescription>
            </DialogHeader>
            <DataTable data={uniqueItems} columns={columns} />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <Label>Toplam Tutar</Label>
                <Input disabled value={`${totalPayAmount}€`} />
              </div>
              <div>
                <Label>{`Bayii Tutarı (${PriceTypes.find(
                  (t) => t.value === dealerPriceType,
                )?.label})`}</Label>
                <Input
                  onClick={(e) => {
                    if (e.currentTarget.value === "*****") {
                      e.currentTarget.value = `${uniqueItems.reduce(
                        (acc, curVal) => {
                          if (dealerPriceType) {
                            const price = curVal.item?.[dealerPriceType];
                            acc += curVal.totalAdded * Number(price);
                          }
                          return acc;
                        },
                        0,
                      )}€`;
                    } else {
                      e.currentTarget.value = "*****";
                    }
                  }}
                  value={`${uniqueItems
                    .reduce((acc, curVal) => {
                      if (dealerPriceType) {
                        const price = curVal.item?.[dealerPriceType];
                        acc += curVal.totalAdded * Number(price);
                      }
                      return acc;
                    }, 0)
                    .toFixed(2)}€`}
                />
              </div>

              <div>
                <div>
                  <Label>İndirim Miktarı %</Label>
                  <Input
                    value={discount.toFixed(2)}
                    onChange={(e) => {
                      if (Number(e.target.value) > 100) {
                        setDiscount(100);
                      } else if (Number(e.target.value) < 0) {
                        setDiscount(0);
                      } else {
                        setDiscount(Number(e.target.value));
                        setPriceToPay(
                          totalPayAmount -
                            (totalPayAmount * Number(e.target.value)) / 100,
                        );
                      }
                    }}
                    type="number"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div>
                <Label className="">Euro Satış Kuru</Label>
                <Input disabled value={euroPrice.data?.satisEkran} />
              </div>
              <div>
                <Label>Ödenecek Miktar (€)</Label>
                <Input
                  value={priceToPay?.toFixed(2) ?? totalPayAmount.toFixed(2)}
                  onChange={(e) => {
                    setPriceToPay(Number(Number(e.target.value).toFixed(2)));
                    setPriceToPayTr(
                      Number(
                        (
                          Number(e.target.value) *
                          Number(euroPrice.data?.satisEkran)
                        ).toFixed(2),
                      ),
                    );
                    setDiscount(
                      -(
                        ((Number(e.target.value) - totalPayAmount) * 100) /
                        totalPayAmount
                      ),
                    );
                  }}
                  type="number"
                  inputMode="numeric"
                />
              </div>
              <div>
                <Label>Ödenecek Miktar (₺)</Label>
                <Input
                  value={
                    priceToPayTr?.toFixed(2) ??
                    (
                      totalPayAmount * Number(euroPrice.data?.satisEkran)
                    ).toFixed(2)
                  }
                  onChange={(e) => {
                    setPriceToPayTr(Number(Number(e.target.value).toFixed(2)));
                    setPriceToPay(
                      Number(
                        (
                          Number(e.target.value) /
                          Number(euroPrice.data?.satisEkran)
                        ).toFixed(2),
                      ),
                    );
                    setDiscount(
                      -(
                        ((Number(e.target.value) /
                          Number(euroPrice.data?.satisEkran) -
                          totalPayAmount) *
                          100) /
                        totalPayAmount
                      ),
                    );
                  }}
                  type="number"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="flex flex-row gap-2">
              <div className="w-full">
                <Label>Ödenen Miktar(€)</Label>
                <Input
                  value={paidAmount}
                  onChange={(e) => {
                    setPaidAmount(Number(Number(e.target.value).toFixed(2)));
                    setPaidAmountTr(
                      Number(
                        (
                          Number(e.target.value) *
                          (euroPrice.data?.satisEkran ?? 1)
                        ).toFixed(2),
                      ),
                    );
                  }}
                  type="number"
                  inputMode="numeric"
                />
              </div>
              <div className="w-full">
                <Label>Ödenen Miktar(₺)</Label>
                <Input
                  value={paidAmountTr}
                  onChange={(e) => {
                    setPaidAmount(
                      Number(
                        (
                          Number(e.target.value) /
                          (euroPrice.data?.satisEkran ?? 1)
                        ).toFixed(2),
                      ),
                    );
                    setPaidAmountTr(Number(Number(e.target.value).toFixed(2)));
                  }}
                  type="number"
                  inputMode="numeric"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={() => onSubmitSell(true)}>
                  Satış İptal Et
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={() => onSubmitSell(false)}>
                  Satış Tamamla
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
          <div className="flex flex-col gap-2">
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
            <div className="flex flex-row gap-2">
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
              <Select
                onValueChange={(e: keyof typeof $Enums.PriceType) =>
                  setSelectedPriceType($Enums.PriceType[e])
                }
                value={selectedPriceType}
                disabled={!selectedCustomerId}
              >
                <SelectTrigger id="itemStorage">
                  <SelectValue placeholder="Tip Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  {PriceTypes.map((s) => {
                    return (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className=" flex flex-row gap-2 rounded border p-3">
              <Checkbox
                checked={isTransferToDealerChecked}
                onCheckedChange={() =>
                  setIsTransferToDealerChecked(!isTransferToDealerChecked)
                }
              />
              <Label>{"Bayii'ye Komisyonu Aktar"}</Label>
            </div>
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
          selectedStorageId={selectedStorageId}
        />
        <UpdateItemDialog
          open={isUpdateItemOpen}
          setOpen={setIsUpdateItemOpen}
          item={ItemsData.data}
          addedItems={addedItems}
          quantity={updateQuantity}
          onUpdateItem={onUpdateItem}
          scannedBarcode={data}
          selectedStorageId={selectedStorageId}
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
                    addedItems={addedItems}
                    selectedStorageId={selectedStorageId}
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

export default NewItemSell;
