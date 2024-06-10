"use client";
import { DataTable } from "~/app/_components/tables/generic-table";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
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
import { api } from "~/trpc/server";

const BrandComp = () => {
  const [brand, setBrand] = useState<string>("");
  const brands = api.items.getBrands.useQuery();
  const addBrand = useAddBrand();

  return (
    <Card className=" w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ürün Markaları</CardTitle>

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
        <DataTable
          data={brands.data ?? []}
          columns={columns}
          isLoading={brands.isLoading}
          pagination
        />
      </CardContent>
    </Card>
  );
};

export default BrandComp;
