"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { Button } from "../_components/ui/button";
import Link from "next/link";
import { api } from "~/trpc/server";
import { columns } from "./components/columns";
import { DataTable } from "../_components/tables/generic-table";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../_components/ui/dialog";
import { Input } from "../_components/ui/input";
import { Label } from "../_components/ui/label";
import { useState } from "react";
import { useAddStorage, useDeleteStorage } from "~/utils/useItems";
import {
  Layers3Icon,
  PaletteIcon,
  RulerIcon,
  TagsIcon,
  TrashIcon,
  WarehouseIcon,
} from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { useSession } from "next-auth/react";
import { PERMS } from "~/_constants/perms";

const Items = () => {
  const { data: session } = useSession();
  const addStorage = useAddStorage();
  const deleteStorage = useDeleteStorage();
  const [storageInput, setStorageInput] = useState<string>();

  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearchInput = useDebounce(searchInput, 750);

  const ItemsData = api.items.getItems.useQuery(
    {
      orgId: session!.user.orgId,
      dealerId: session!.user.dealerId,
      searchInput: debouncedSearchInput,
    },
    { enabled: Boolean(session) },
  );

  const storages = api.items.getStorages.useQuery();

  const router = useRouter();

  return (
    <Card className="flex w-full flex-col overflow-x-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ürün Listesi</CardTitle>
        <div className=" flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Depolar</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Depolar</DialogTitle>
              </DialogHeader>
              {storages.data && (
                <Card>
                  <CardHeader>
                    <CardTitle>Depolar</CardTitle>
                  </CardHeader>
                  {storages.data.length > 0 ? (
                    <CardContent>
                      <ul className="flex list-disc flex-col gap-3 pl-3">
                        {storages.data.map((s) => {
                          return (
                            <li key={s.id}>
                              <div className="flex items-center gap-3">
                                <p>{s.name}</p>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant={"destructive"}>
                                      <TrashIcon width={"15px"} />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Emin Misin?</DialogTitle>
                                      <DialogDescription>
                                        Eğer bu depoyu silersen bütün
                                        içerisindeki stoklar ile birlikte
                                        silinecektir!
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogClose asChild>
                                      <Button variant={"outline"}>
                                        Vazgeç
                                      </Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                      <Button
                                        onClick={() =>
                                          deleteStorage.mutate(s.id)
                                        }
                                        variant={"destructive"}
                                      >
                                        Sil
                                      </Button>
                                    </DialogClose>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </CardContent>
                  ) : (
                    <CardContent>Depo Bulunamadı!</CardContent>
                  )}
                </Card>
              )}
              {session?.user.permissions.includes(PERMS.manage_storage) && (
                <>
                  <div>
                    <Label>Depo Adı</Label>
                    <Input
                      value={storageInput}
                      onChange={(v) => setStorageInput(v.target.value)}
                      placeholder="Depo Adı..."
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (storageInput)
                        addStorage.mutate({
                          name: storageInput,
                        });
                    }}
                    disabled={!storageInput}
                  >
                    Ekle
                  </Button>
                </>
              )}
            </DialogContent>
          </Dialog>

          <Link href={"/items/new-item"}>
            <Button>Yeni ürün ekle</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className=" w-full">
        <DataTable
          data={ItemsData.data}
          columns={columns}
          isLoading={ItemsData.isLoading}
          columnFilter={[
            {
              columnToFilter: "itemBrandId",
              title: "Marka",
              options: [
                ...new Set(ItemsData.data?.flatMap((i) => i.brand)),
              ].map((b) => ({
                label: b.name,
                value: b.id,
              })),
              icon: <TagsIcon className="mr-2 h-5 w-5" />,
            },
            {
              columnToFilter: "itemColorId",
              title: "Renk",
              options: [
                ...new Set(ItemsData.data?.flatMap((i) => i.color)),
              ].map((b) => ({
                label: b.colorCode,
                value: b.id,
              })),
              icon: <PaletteIcon className="mr-2 h-5 w-5" />,
            },
            {
              columnToFilter: "itemSizeId",
              title: "Beden",
              options: [...new Set(ItemsData.data?.flatMap((i) => i.size))].map(
                (b) => ({
                  label: b.sizeCode,
                  value: b.id,
                }),
              ),
              icon: <RulerIcon className="mr-2 h-5 w-5" />,
            },
            {
              columnToFilter: "itemCategoryId",
              title: "Kategori",
              options: [
                ...new Set(ItemsData.data?.flatMap((i) => i.category)),
              ].map((b) => ({
                label: b.name,
                value: b.id,
              })),
              icon: <Layers3Icon className="mr-2 h-5 w-5" />,
            },
            {
              columnToFilter: "totalStock",
              title: "Depo",
              options: [
                ...new Set(
                  ItemsData.data?.flatMap((i) =>
                    i.ItemStock.flatMap((s) => s.storage),
                  ),
                ),
              ].map((b) => ({
                label: b.name,
                value: b.id,
              })),
              icon: <WarehouseIcon className="mr-2 h-5 w-5" />,
            },
          ]}
          pagination
          serverSearch={{
            setState: setSearchInput,
            state: searchInput,
            title: "kod, barkod, isim",
          }}
          onRowClick={(row) => router.push(`items/${row.original?.id}}`)}
        />
      </CardContent>
    </Card>
  );
};

export default Items;
