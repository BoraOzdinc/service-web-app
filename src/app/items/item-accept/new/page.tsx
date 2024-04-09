"use client";
import { useDebounce } from "@uidotdev/usehooks";
import {
  Layers3Icon,
  PaletteIcon,
  RulerIcon,
  TagsIcon,
  WarehouseIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DataTable } from "~/app/_components/tables/generic-table";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { columns } from "./components/columns";
import { useMediaDevices } from "react-media-devices";
import BarcodeScannerComponent from "react-barcode-scanner-updated";
import BarcodeScanner from "~/app/_components/BarcodeScanner";

const NewItemAccept = () => {
  const hydrated = useHydrated();
  const { data: session } = useSession();
  const [selectedStorageId, setSelectedStorageId] = useState<
    string | undefined
  >();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState("");
  const storages = api.items.getStorages.useQuery();
  /*  
  const ItemsData = api.items.getItemsInStorage.useQuery(
    {
      storageId: selectedStorageId!,
      searchInput: debouncedSearchInput,
      orgId: session?.user.orgId,
      dealerId: session?.user.dealerId,
    },
    { enabled: !open && Boolean(selectedStorageId) && Boolean(session) },
  ); */

  if (!hydrated) {
    return null;
  }
  return (
    <Card className="flex w-full flex-col">
      <CardHeader>
        <CardTitle>Yeni Ürün Kabul</CardTitle>
      </CardHeader>
      <Dialog open={open} onOpenChange={setOpen}>
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
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={!selectedStorageId}>Kaydet</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CardContent className=" w-full overflow-scroll sm:overflow-auto">
        <BarcodeScanner setData={setData} />

        <p>{data}</p>
        {/* <DataTable
          data={ItemsData.data}
          columns={columns}
          isLoading={ItemsData.isLoading}
          pagination
          serverSearch={{
            setState: setSearchInput,
            state: searchInput,
            title: "kod, barkod, isim",
          }}
        /> */}
      </CardContent>
    </Card>
  );
};

export default NewItemAccept;
