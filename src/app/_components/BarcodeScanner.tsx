import BarcodeScannerComponent from "react-barcode-scanner-updated";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

const BarcodeScanner = ({
  setData,
}: {
  setData: Dispatch<SetStateAction<string>>;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Open</DialogTrigger>
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
          }}
          onUpdate={(err, result) => {
            if (result) {
              toast.success(`Barkod: ${result.getText()}`);
              setData(result.getText());
              setOpen(!open);
            }
          }}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">İptal</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScanner;
