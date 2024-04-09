"use client";
import { useDebounce } from "@uidotdev/usehooks";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
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

const NewItemAccept = () => {
  const hydrated = useHydrated();
  const { data: session } = useSession();
  const [selectedStorageId, setSelectedStorageId] = useState<
    string | undefined
  >();
  const debouncedStorageId = useDebounce(selectedStorageId, 100);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isStorageOpen, setIsStorageOpen] = useState(true);

  const [data, setData] = useState("");
  const storages = api.items.getStorages.useQuery();

  const ItemsData = api.items.getItemWithBarcode.useQuery(
    {
      orgId: session?.user.orgId,
      dealerId: session?.user.dealerId,
      barcode: data,
    },
    {
      enabled:
        !isStorageOpen &&
        !isBarcodeOpen &&
        Boolean(selectedStorageId) &&
        Boolean(session) &&
        !!data,
    },
  );

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
      </CardHeader>

      <Dialog defaultOpen open={isStorageOpen} onOpenChange={setIsStorageOpen}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Ürün Kabul Depo Seçimi</DialogTitle>
            <DialogDescription>
              Hangi Depo İçin Ürün Kabul Yapmak İstediğinizi Seçin.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            {storages.isLoading && <Loader2 className="h-6 w-6 animate-spin" />}
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
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                disabled={
                  debouncedStorageId !== selectedStorageId || !selectedStorageId
                }
              >
                Kaydet
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CardContent className=" w-full overflow-scroll sm:overflow-auto">
        <p>{ItemsData.data?.name}</p>
        {
          //? renk beden isim kod barkod
          /* <DataTable
          data={ItemsData.data}
          columns={columns}
          isLoading={ItemsData.isLoading}
          pagination
          serverSearch={{
            setState: setSearchInput,
            state: searchInput,
            title: "kod, barkod, isim",
          }}
        /> */
        }
      </CardContent>
    </Card>
  );
};

export default NewItemAccept;
