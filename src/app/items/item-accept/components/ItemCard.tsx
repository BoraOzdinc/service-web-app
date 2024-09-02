import { useMemo, useState } from "react";
import { Badge } from "~/app/_components/ui/badge";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { type ItemWithBarcode } from "~/utils/useItems";

const ItemCard = ({
  item,
  barcode,
  onUpdateItem,
  onDeleteItem,
  addedItems,
  selectedStorageId,
  sellUpdate,
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
    serialNumbers?: string[];
    quantity: number;
    totalAdded?: number;
  };
  addedItems?: {
    item: ItemWithBarcode;
    barcode: string;
    quantity: number;
    totalAdded?: number;
  }[];
  selectedStorageId?: string;
  onUpdateItem: (
    barcode: string,
    quantity: number,
    conflict: boolean,
    serialNumbers?: string[],
  ) => void;
  onDeleteItem: (barcode: string) => void;
  sellUpdate?: boolean;
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [serialNumberList, setSerialNumberList] = useState<string[]>(
    item.serialNumbers ?? [],
  );

  const existingItemTotalAddedStock = useMemo(() => {
    if (addedItems) {
      const items = addedItems.filter((i) => i.item?.id === item.item?.id);
      return items.reduce((acc, curVal) => {
        return acc + (curVal.totalAdded ?? 0);
      }, 0);
    }
  }, [addedItems, item.item?.id]);

  const totalStock = useMemo(() => {
    if (selectedStorageId) {
      return item.item?.ItemStock.find(
        (s) => s.Storage?.id === selectedStorageId,
      )?.stock;
    }
  }, [item.item?.ItemStock, selectedStorageId]);

  if (item.item) {
    return (
      <Dialog
        key={item.barcode}
        onOpenChange={() => {
          setQuantity(item.quantity);
          setSerialNumberList(item.serialNumbers ?? []);
          setQuantity(item.quantity);
        }}
      >
        <DialogTrigger asChild>
          <div className="flex cursor-pointer flex-col gap-1 rounded border p-1 transition-colors hover:bg-accent hover:text-accent-foreground">
            <div className="font-semibold">{item.item.name}</div>
            <div className="text-xs font-semibold">{`Barkod ve Birimi: ${item.barcode} - ${barcode?.unit} / ${barcode?.quantity}`}</div>
            <div className="text-xs font-semibold">{`Ürün Kodu: ${item.item.itemCode}`}</div>
            <div className="text-xs font-semibold">{`Renk: ${item.item.ItemColor?.colorText}`}</div>
            <div className="text-xs font-semibold">{`Beden: ${item.item.ItemSize?.sizeText}`}</div>
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
            <div className=" font-semibold">{`Renk: ${item.item.ItemColor?.colorText}`}</div>
            <div className=" font-semibold">{`Beden: ${item.item.ItemSize?.sizeText}`}</div>
            {existingItemTotalAddedStock && totalStock && barcode && (
              <>
                <div>{`Bu Üründen Toplam Eklenen Miktar: ${existingItemTotalAddedStock}`}</div>
                <div>{`Toplam Depodaki Miktar: ${totalStock}`}</div>
                {totalStock < quantity * barcode.quantity && (
                  <div className="text-red-500">
                    Deponuzda Yeterli Sayıda Ürün Bulunmamakta!
                  </div>
                )}
              </>
            )}
            <div>
              <Label>Adet</Label>
              <Input
                placeholder="Adet"
                inputMode="numeric"
                name="update-quantity-input"
                defaultValue={String(quantity)}
                onChange={(e) => {
                  setQuantity(Number(e.target.value));
                }}
                type="number"
              />
            </div>
            {sellUpdate && item.item.isSerialNoRequired && (
              <div className="flex flex-col gap-2">
                <Label>Seri Numaraları</Label>
                <div className="flex gap-2">
                  <Input
                    disabled={!item}
                    value={serialNumber}
                    onChange={(e) => {
                      setSerialNumber(e.target.value);
                    }}
                  />
                  <Button
                    disabled={
                      !serialNumber || serialNumberList.length === quantity
                    }
                    onClick={() => {
                      setSerialNumberList([...serialNumberList, serialNumber]);
                      setSerialNumber("");
                    }}
                  >
                    Seri Numarası Ekle
                  </Button>
                </div>
                <div className=" min-h-[30px] w-full  rounded border p-1">
                  {serialNumberList.length ? (
                    serialNumberList.map((s) => (
                      <Badge
                        className="m-[3px]"
                        key={s}
                        onClick={() => {
                          setSerialNumberList(
                            serialNumberList.filter((serial) => serial !== s),
                          );
                        }}
                      >
                        {s}
                      </Badge>
                    ))
                  ) : (
                    <p>Lütfen Seri Numaralarını Ekleyin</p>
                  )}
                </div>
              </div>
            )}
            <DialogClose asChild>
              <Button
                disabled={
                  !!(quantity === item.quantity) ||
                  !!(
                    totalStock &&
                    barcode &&
                    existingItemTotalAddedStock &&
                    totalStock < quantity * barcode.quantity - item.quantity
                  ) ||
                  (sellUpdate && serialNumberList.length !== quantity)
                }
                onClick={() =>
                  onUpdateItem(item.barcode, quantity, false, serialNumberList)
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
export default ItemCard;
