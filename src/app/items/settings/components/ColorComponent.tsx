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
import { columns } from "./colorColumns";
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
import { useAddColor } from "~/utils/useItems";

const ColorComp = () => {
  const colors = api.items.getColors.useQuery(undefined, { retry: false });
  const colorsData = colors.data ?? [];
  const [colorCode, setColorCode] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const addColor = useAddColor();

  return (
    <Card className=" w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <CardTitle>Ürün Renkleri</CardTitle>
          {colors.isLoading && <Loader2Icon className="h-5 w-5 animate-spin" />}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={colors.isLoading || addColor.isLoading}
              isLoading={addColor.isLoading}
            >
              Renk Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Renk</DialogTitle>
            </DialogHeader>
            <div>
              <Label>Renk Kodu</Label>
              <Input
                value={colorCode}
                onChange={(v) => {
                  setColorCode(v.target.value);
                }}
                placeholder="Renk Kodu..."
              />
            </div>
            <div>
              <Label>Renk İsmi</Label>
              <Input
                value={color}
                onChange={(v) => {
                  setColor(v.target.value);
                }}
                placeholder="Renk İsmi..."
              />
            </div>
            <DialogClose asChild>
              <Button
                isLoading={addColor.isLoading}
                disabled={
                  (colorCode.length < 1 && color.length < 1) ||
                  addColor.isLoading
                }
                onClick={() => {
                  addColor.mutate({ colorCode: colorCode, colorText: color });
                }}
              >
                Onayla
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className=" w-full overflow-x-auto ">
        <DataTable data={colorsData} columns={columns} />
      </CardContent>
    </Card>
  );
};

export default ColorComp;
