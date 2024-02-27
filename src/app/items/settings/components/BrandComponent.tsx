"use client";
import { Loader2Icon } from "lucide-react";
import { DataTable } from "~/app/_components/tables/generic-table";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { api } from "~/trpc/server";
import { columns } from "./brandColumns";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { Label } from "~/app/_components/ui/label";
import { Input } from "~/app/_components/ui/input";
import { useState } from "react";
import { useAddBrand } from "~/utils/useItems";

const BrandComp = () => {
  const brands = api.items.getBrands.useQuery();
  const brandsData = brands.data ?? [];
  const [brand, setBrand] = useState<string>("");
  const addBrand = useAddBrand();

  return (
    <Card className=" w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <CardTitle>Ürün Markaları</CardTitle>
          {brands.isLoading && <Loader2Icon className="h-5 w-5 animate-spin" />}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={brands.isLoading || addBrand.isLoading}
              isLoading={addBrand.isLoading}
            >
              Marka Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni MArka</DialogTitle>
            </DialogHeader>
            <div>
              <Label>Marka Adı</Label>
              <Input
                value={brand}
                onChange={(v) => {
                  setBrand(v.target.value);
                }}
                placeholder="Marka..."
              />
            </div>
            <DialogClose asChild>
              <Button
                isLoading={addBrand.isLoading}
                disabled={brand.length < 1 || addBrand.isLoading}
                onClick={() => {
                  addBrand.mutate(brand);
                }}
              >
                Onayla
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className=" w-full overflow-x-auto ">
        <DataTable data={brandsData} columns={columns} />
      </CardContent>
    </Card>
  );
};

export default BrandComp;
