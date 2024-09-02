import { Loader2 } from "lucide-react";
import { type Dispatch, type SetStateAction, useState, useMemo } from "react";
import { Badge } from "~/app/_components/ui/badge";
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
  selectedStorageId,
}: {
  item: ItemWithBarcode | undefined;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  barcode: string;
  onAddItem: (
    item: ItemWithBarcode,
    quantity: number,
    serialNumbers: string[],
  ) => void;
  selectedStorageId: string | undefined;
}) => {
  const itemBarcode = item?.itemBarcode.find((b) => b.barcode === barcode);
  const [quantity, setQuantity] = useState(1);
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [serialNumberList, setSerialNumberList] = useState<string[]>([]);
  const totalStock = useMemo(() => {
    return item?.ItemStock.find((s) => s.Storage?.id === selectedStorageId)
      ?.stock;
  }, [item?.ItemStock, selectedStorageId]);
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        setSerialNumberList([]);
        setSerialNumber("");
        setQuantity(1);
      }}
    >
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
              <div>{`Depoda Bulunan Toplam Stok: ${
                totalStock ? totalStock : "0"
              }`}</div>
              <div>{`Seri Numarası Zorunlu: ${
                item.isSerialNoRequired ? "Evet" : "Hayır"
              }`}</div>
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
              if (Number(e.target.value) <= 0) {
                setQuantity(1);
              } else {
                setQuantity(Number(e.target.value));
              }
            }}
          />
        </div>
        {item?.isSerialNoRequired && (
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
                disabled={!serialNumber || serialNumberList.length === quantity}
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
        <Button
          disabled={Boolean(
            isLoading ||
              !item ||
              Boolean(
                quantity * (itemBarcode?.quantity ?? 0) > (totalStock ?? 0),
              ) ||
              !(item.isSerialNoRequired
                ? serialNumberList.length === quantity
                : true),
          )}
          onClick={() => {
            if (item) {
              onAddItem(item, quantity, serialNumberList);
              setSerialNumberList([]);
              setSerialNumber("");
              setQuantity(1);
            }
          }}
        >
          Ekle
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            setOpen(false);
            setSerialNumberList([]);
            setSerialNumber("");
            setQuantity(1);
          }}
        >
          İptal
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default AddItemDialog;
