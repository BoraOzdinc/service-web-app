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
import Loader from "../_components/loader";
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
} from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";

const Items = () => {
  const storages = api.items.getStorages.useQuery();
  const brands = api.items.getBrands.useQuery();
  const colors = api.items.getColors.useQuery();
  const sizes = api.items.getSizes.useQuery();
  const categories = api.items.getCategory.useQuery();
  const addStorage = useAddStorage();
  const deleteStorage = useDeleteStorage();
  const [storageInput, setStorageInput] = useState<string>();

  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearchInput = useDebounce(searchInput, 750);

  const ItemsData = api.items.getItems.useQuery(debouncedSearchInput);
  const router = useRouter();

  if (brands.isLoading) {
    return <Loader />;
  }

  return (
    <Card className="flex w-full flex-col overflow-x-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ürün Listesi</CardTitle>
        <div className=" flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button isLoading={storages.isLoading}>Depo Ekle</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Depo</DialogTitle>
              </DialogHeader>
              {storages.data && (
                <Card>
                  <CardHeader>
                    <CardTitle>Depolar</CardTitle>
                  </CardHeader>
                  <CardContent className="">
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
                                      Eğer bu depoyu silersen bütün içerisindeki
                                      stoklar ile birlikte silinecektir!
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogClose asChild>
                                    <Button variant={"outline"}>Vazgeç</Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button
                                      onClick={() => deleteStorage.mutate(s.id)}
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
                </Card>
              )}
              <div>
                <Label>Depo Adı</Label>
                <Input
                  value={storageInput}
                  onChange={(v) => setStorageInput(v.target.value)}
                  placeholder="Depo Adı..."
                />
              </div>
              <Button
                onClick={() => addStorage.mutate(storageInput!)}
                disabled={!storageInput}
              >
                Ekle
              </Button>
            </DialogContent>
          </Dialog>

          <Link href={"/items/new-item"}>
            <Button>Yeni ürün ekle</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className=" w-full">
        {brands.data && colors.data && sizes.data && categories.data && (
          <DataTable
            data={ItemsData.data}
            columns={columns}
            columnFilter={[
              {
                columnToFilter: "itemBrandId",
                title: "Marka",
                options: brands.data.map((b) => ({
                  label: b.name,
                  value: b.id,
                })),
                icon: <TagsIcon className="mr-2 h-5 w-5" />,
              },
              {
                columnToFilter: "itemColorId",
                title: "Renk",
                options: colors.data.map((b) => ({
                  label: b.colorCode,
                  value: b.id,
                })),
                icon: <PaletteIcon className="mr-2 h-5 w-5" />,
              },
              {
                columnToFilter: "itemSizeId",
                title: "Beden",
                options: sizes.data.map((b) => ({
                  label: b.sizeCode,
                  value: b.id,
                })),
                icon: <RulerIcon className="mr-2 h-5 w-5" />,
              },
              {
                columnToFilter: "itemCategoryId",
                title: "Kategori",
                options: categories.data.map((b) => ({
                  label: b.name,
                  value: b.id,
                })),
                icon: <Layers3Icon className="mr-2 h-5 w-5" />,
              },
            ]}
            pagination
            serverSearch={{
              setState: setSearchInput,
              state: searchInput,
              title: "kod, barkod, isim",
              isLoading: ItemsData.isLoading,
            }}
            onRowClick={(row) => router.push(`items/${row.original?.id}}`)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Items;
