"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { api } from "~/trpc/server";
import { Controller, useForm } from "react-hook-form";
import { Label } from "~/app/_components/ui/label";
import { Input } from "~/app/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import { Button } from "~/app/_components/ui/button";
import { useAddItem } from "~/utils/useItems";
import { redirect, useRouter } from "next/navigation";

interface FormInput {
  productName: string;
  barcode: string;
  serialNo: string;
  brand: string;
  storage: string;
  mainDealerPrice: string;
  multiPrice: string;
  dealerPrice: string;
  singlePrice: string;
  stock: number;
}

const NewItem = () => {
  const storages = api.items.getStorages.useQuery();
  const addItem = useAddItem();
  const router = useRouter();
  const { control, handleSubmit, formState } = useForm<FormInput>({
    defaultValues: { stock: 0 },
  });

  function onSubmitForm(data: FormInput) {
    addItem.mutate(data);
  }
  return (
    <Card className="h-full w-screen">
      <CardHeader>
        <CardTitle>Yeni Eşya Ekle</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmitForm)}
        >
          <div>
            <Label htmlFor="itemName">Ürün İsmi</Label>
            <Controller
              name="productName"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <Input {...field} id="itemName" placeholder="Ürün İsmi" />
              )}
            />
          </div>
          <div>
            <Label htmlFor="itemBarcode">Barkod</Label>
            <Controller
              name="barcode"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <Input {...field} id="itemBarcode" placeholder="Ürün Barkodu" />
              )}
            />
          </div>
          <div>
            <Label htmlFor="itemSerialNo">Seri Numarası</Label>
            <Controller
              name="serialNo"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="itemSerialNo"
                  placeholder="Ürün Seri Numarası"
                />
              )}
            />
          </div>
          <div>
            <Label htmlFor="itemBrand">Markası</Label>
            <Controller
              name="brand"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <Input {...field} id="itemBrand" placeholder="Ürün Markası" />
              )}
            />
          </div>
          <div>
            <Label htmlFor="itemStorage">Markası</Label>
            <Controller
              name="storage"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  name={field.name}
                  value={field.value}
                  disabled={storages.isLoading}
                >
                  <SelectTrigger
                    onBlur={field.onBlur}
                    disabled={field.disabled}
                    ref={field.ref}
                    id="itemStorage"
                  >
                    <SelectValue placeholder="Depo Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {storages.data?.map((s) => {
                      return (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="itemMainDealer">Anabayi Satış Fiyatı</Label>
            <Controller
              name="mainDealerPrice"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <Input {...field} id="itemMainDealer" placeholder="" />
              )}
            />
          </div>
          <div>
            <Label htmlFor="itemMultiPrice">Toptan Satış Fiyatı</Label>
            <Controller
              name="multiPrice"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <Input {...field} id="itemMultiPrice" placeholder="" />
              )}
            />
          </div>
          <div>
            <Label htmlFor="itemDealerPrice">Bayi Satış Fiyatı</Label>
            <Controller
              name="dealerPrice"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <Input {...field} id="itemDealerPrice" placeholder="" />
              )}
            />
          </div>
          <div>
            <Label htmlFor="itemSinglePrice">Perekende Satış Fiyatı</Label>
            <Controller
              name="singlePrice"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <Input {...field} id="itemSinglePrice" placeholder="" />
              )}
            />
          </div>
          <div>
            <Label htmlFor="stock">Stok</Label>
            <Controller
              name="stock"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(e) => field.onChange(+e.target.value)}
                  type="number"
                  id="stock"
                  placeholder=""
                />
              )}
            />
          </div>
          <Button disabled={!formState.isValid} type="submit">
            Kaydet
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewItem;
