"use client";
import { DataTable } from "~/app/_components/tables/generic-table";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { columns } from "./sizeColumns";
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
import { useAddSize } from "~/utils/useItems";
import { api } from "~/trpc/server";

const SizeComp = () => {
  const sizes = api.items.getSizes.useQuery();
  const [sizeCode, setSizeCode] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const addSize = useAddSize();

  return (
    <Card className=" w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ürün Bedenleri</CardTitle>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={sizes.isLoading || addSize.isLoading}
              isLoading={addSize.isLoading}
            >
              Beden Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Beden</DialogTitle>
            </DialogHeader>
            <div>
              <Label>Beden Kodu</Label>
              <Input
                value={sizeCode}
                onChange={(v) => {
                  setSizeCode(v.target.value);
                }}
                placeholder="Beden Kodu..."
              />
            </div>
            <div>
              <Label>Beden İsmi</Label>
              <Input
                value={size}
                onChange={(v) => {
                  setSize(v.target.value);
                }}
                placeholder="Beden İsmi..."
              />
            </div>
            <DialogClose asChild>
              <Button
                isLoading={addSize.isLoading}
                disabled={
                  (sizeCode.length < 1 && size.length < 1) || addSize.isLoading
                }
                onClick={() => {
                  addSize.mutate({ sizeCode: sizeCode, sizeText: size });
                }}
              >
                Onayla
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <DataTable
          data={sizes.data ?? []}
          columns={columns}
          isLoading={sizes.isLoading}
          pagination
        />
      </CardContent>
    </Card>
  );
};

export default SizeComp;
