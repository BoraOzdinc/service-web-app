import { Loader2 } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/app/_components/ui/dialog";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { type ItemWithBarcode } from "~/utils/useItems";

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
              <div>{`Ürün Rengi: ${item.ItemColor?.colorText}`} </div>
              <div>{`Ürün Bedeni: ${item.ItemSize?.sizeText}`} </div>
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
            inputMode="numeric"
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
export default AddItemDialog;
