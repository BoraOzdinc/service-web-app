import { useMemo, useState } from "react";
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
    totalAdded?: number;
  };
  addedItems?: {
    item: ItemWithBarcode;
    barcode: string;
    quantity: number;
    totalAdded?: number;
  }[];
  selectedStorageId?: string;
  onUpdateItem: (barcode: string, quantity: number, conflict: boolean) => void;
  onDeleteItem: (barcode: string) => void;
}) => {
  const [quantity, setQuantity] = useState(item.quantity);

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
        (s) => s.storage.id === selectedStorageId,
      )?.stock;
    }
  }, [item.item?.ItemStock, selectedStorageId]);

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
            <DialogClose asChild>
              <Button
                disabled={
                  !!(quantity === item.quantity) ||
                  !!(
                    totalStock &&
                    barcode &&
                    existingItemTotalAddedStock &&
                    totalStock <
                      existingItemTotalAddedStock +
                        quantity * barcode.quantity -
                        item.quantity
                  )
                }
                onClick={() => onUpdateItem(item.barcode, quantity, false)}
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
