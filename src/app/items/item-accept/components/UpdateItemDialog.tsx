import { type Dispatch, type SetStateAction, useMemo } from "react";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/app/_components/ui/dialog";
import { type ItemWithBarcode } from "~/utils/useItems";

const UpdateItemDialog = ({
  open,
  setOpen,
  item,
  addedItems,
  quantity,
  onUpdateItem,
  scannedBarcode,
  selectedStorageId,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: ItemWithBarcode | undefined;
  addedItems: {
    item: ItemWithBarcode;
    barcode: string;
    quantity: number;
    totalAdded?: number;
  }[];
  quantity: number;
  onUpdateItem: (barcode: string, quantity: number, conflict: boolean) => void;
  scannedBarcode: string;
  selectedStorageId?: string;
}) => {
  const existingItem = useMemo(() => {
    return addedItems.find((i) => i.barcode === scannedBarcode);
  }, [addedItems, scannedBarcode]);

  const existingItemTotalAddedStock = useMemo(() => {
    const items = addedItems.filter((i) => i.item?.id === item?.id);
    return items.reduce((acc, curVal) => {
      return acc + (curVal.totalAdded ?? 0);
    }, 0);
  }, [addedItems, item?.id]);

  const totalStock = useMemo(() => {
    return item?.ItemStock.find((s) => s.storage.id === selectedStorageId)
      ?.stock;
  }, [item?.ItemStock, selectedStorageId]);

  const barcodeDetails = useMemo(() => {
    return item?.itemBarcode.find((b) => b.barcode === scannedBarcode);
  }, [item?.itemBarcode, scannedBarcode]);

  if (!existingItem) {
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {existingItem && (
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="flex flex-col gap-3"
        >
          <DialogHeader>
            <DialogTitle>Bu Ürün Eklendi!</DialogTitle>
            <DialogDescription>
              Bu Ürün Zaten Eklendi Düzenlemek İstiyor Musun?
            </DialogDescription>
          </DialogHeader>
          <DialogDescription>{`Bu Barkodun Önceki Miktarı: ${existingItem.quantity}`}</DialogDescription>
          <DialogDescription>{`Bu Barkodun Şimdiki Miktarı: ${quantity}`}</DialogDescription>
          <DialogDescription>{`Bu Barkodun Toplam Miktarı: ${
            existingItem.quantity + quantity
          }`}</DialogDescription>
          {existingItem.totalAdded && totalStock && barcodeDetails && (
            <>
              <DialogDescription>{`Bu Üründen Toplam Eklenen Miktar: ${existingItemTotalAddedStock}`}</DialogDescription>
              <DialogDescription>{`Toplam Depodaki Miktar: ${totalStock}`}</DialogDescription>
              {totalStock <
                existingItemTotalAddedStock +
                  quantity * barcodeDetails.quantity && (
                <DialogDescription className="text-red-500">
                  Deponuzda Yeterli Sayıda Ürün Bulunmamakta!
                </DialogDescription>
              )}
            </>
          )}
          <DialogFooter className="flex gap-3">
            <DialogClose asChild>
              <Button variant={"outline"}>İptal</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                disabled={
                  !!totalStock &&
                  !!barcodeDetails &&
                  !!(
                    totalStock <
                    existingItemTotalAddedStock +
                      quantity * barcodeDetails.quantity
                  )
                }
                onClick={() => {
                  if (item) {
                    onUpdateItem(scannedBarcode, quantity, true);
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
export default UpdateItemDialog;
