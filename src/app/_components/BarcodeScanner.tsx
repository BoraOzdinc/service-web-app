import BarcodeScannerComponent from "react-barcode-scanner-updated";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Input } from "./ui/input";
import { ScanBarcodeIcon } from "lucide-react";

const BarcodeScanner = ({
  setData,
  open,
  setOpen,
}: {
  setData: Dispatch<SetStateAction<string>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [barcode, setBarcode] = useState<string>("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <ScanBarcodeIcon className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center">
        <DialogHeader>
          <DialogTitle>Barkod Okut</DialogTitle>
        </DialogHeader>
        <BarcodeScannerComponent
          height={500}
          width={500}
          stopStream={false}
          videoConstraints={{
            noiseSuppression: true,
            facingMode: "environment",
          }}
          onUpdate={(err, result) => {
            if (result) {
              setData(result.getText());
              setOpen(!open);
            }
          }}
        />
        <Input
          type="number"
          placeholder="Barkod"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
        <DialogFooter className="flex flex-row gap-3">
          <DialogClose asChild>
            <Button variant="outline">İptal</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button disabled={!barcode} onClick={() => setData(barcode)}>
              Kaydet
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScanner;
