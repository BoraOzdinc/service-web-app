"use client";
import { DataTable } from "~/app/_components/tables/generic-table";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { columns } from "./categoryColumns";
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
import { useAddCategory } from "~/utils/useItems";
import { type getCategoriesType } from "./queryFunctions";

const CategoryComp = ({ categories }: { categories: getCategoriesType }) => {
  const [category, setCategory] = useState<string>("");
  const addCategory = useAddCategory();

  return (
    <Card className=" w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ürün Kategorileri</CardTitle>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={categories.isLoading || addCategory.isLoading}
              isLoading={addCategory.isLoading}
            >
              Kategori Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Kategori</DialogTitle>
            </DialogHeader>
            <div>
              <Label>Kategori Adı</Label>
              <Input
                value={category}
                onChange={(v) => {
                  setCategory(v.target.value);
                }}
                placeholder="Kategori..."
              />
            </div>
            <DialogClose asChild>
              <Button
                isLoading={addCategory.isLoading}
                disabled={category.length < 1 || addCategory.isLoading}
                onClick={() => {
                  addCategory.mutate(category);
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
          data={categories.data ?? []}
          columns={columns}
          isLoading={categories.isLoading}
          pagination
        />
      </CardContent>
    </Card>
  );
};

export default CategoryComp;
