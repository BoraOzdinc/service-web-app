"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
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
import { api } from "~/trpc/server";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import ComboBox from "~/app/_components/ComboBox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { Checkbox } from "~/app/_components/ui/checkbox";

export interface FormInput {
  productName: string;
  barcode: string;
  itemCode: string;
  itemBrandId: string;
  storageId: string;
  itemColorId: string;
  itemSizeId: string;
  itemCategoryId: string;
  mainDealerPrice: string;
  multiPrice: string;
  dealerPrice: string;
  singlePrice: string;
  stock: number;
  netWeight: string;
  volume: string;
  isSerialNoRequired: boolean;
  isServiceItem: boolean;
}

const NewItem = () => {
  const addItem = useAddItem();
  const storages = api.items.getStorages.useQuery();
  const colors = api.items.getColors.useQuery();
  const sizes = api.items.getSizes.useQuery();
  const categories = api.items.getCategory.useQuery();
  const brands = api.items.getBrands.useQuery();
  const form = useForm<FormInput>({
    defaultValues: {
      isSerialNoRequired: false,
      isServiceItem: false,
    },
  });

  function onSubmitForm(data: FormInput) {
    console.log(data);
    addItem.mutate({ ...data });
  }
  return (
    <Card className="h-full w-screen">
      <CardHeader>
        <CardTitle>Yeni Ürün Ekle</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)}>
            <div className="flex w-full flex-col gap-3">
              <div className=" grid grid-cols-1 gap-3 md:grid-cols-4">
                <FormField
                  name="productName"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ürün İsmi</FormLabel>
                      <FormControl>
                        <Input placeholder="Ürün" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="barcode"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ürün Barkodu</FormLabel>
                      <FormControl>
                        <Input placeholder="Barkod" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="itemCode"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ürün Kodu</FormLabel>
                      <FormControl>
                        <Input placeholder="Kod" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="itemColorId"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 pt-[0.35rem]">
                      <FormLabel>Ürün Rengi</FormLabel>
                      <FormControl>
                        <ComboBox
                          data={colors.data?.map((d) => ({
                            label: `${d.colorCode} ${d.colorText}`,
                            value: d.id,
                          }))}
                          name={field.name}
                          onChange={field.onChange}
                          value={field.value}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="itemSizeId"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 pt-[0.35rem]">
                      <FormLabel>Ürün Bedeni</FormLabel>
                      <FormControl>
                        <ComboBox
                          data={sizes.data?.map((d) => ({
                            label: `${d.sizeCode} ${d.sizeText}`,
                            value: d.id,
                          }))}
                          name={field.name}
                          onChange={field.onChange}
                          value={field.value}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="itemCategoryId"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 pt-[0.35rem]">
                      <FormLabel>Ürün Kategorisi</FormLabel>
                      <FormControl>
                        <ComboBox
                          data={categories.data?.map((d) => ({
                            label: d.name,
                            value: d.id,
                          }))}
                          name={field.name}
                          onChange={field.onChange}
                          value={field.value}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="itemBrandId"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 pt-[0.35rem]">
                      <FormLabel>Ürün Markası</FormLabel>
                      <FormControl>
                        <ComboBox
                          data={brands.data?.map((d) => ({
                            label: d.name,
                            value: d.id,
                          }))}
                          name={field.name}
                          onChange={field.onChange}
                          value={field.value}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="storageId"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Depo</FormLabel>
                      <FormControl>
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="mainDealerPrice"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anabayi Satış Fiyatı</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="multiPrice"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Toptan Satış Fiyatı</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="dealerPrice"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bayi Satış Fiyatı</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="singlePrice"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perekende Satış Fiyatı</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="stock"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stok</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder=""
                          {...field}
                          onChange={(e) => {
                            field.onChange(+e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="netWeight"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Net Ağırlık (KG)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step="0.001"
                          placeholder=""
                          {...field}
                          onChange={(e) => {
                            field.onChange(String(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="volume"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ürün Hacmi (CDM)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.001"
                          min={0}
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isServiceItem"
                  render={({ field }) => (
                    <FormItem className="flex flex-row  items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Servis Ürünü</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isSerialNoRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row  items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Seri No. Zorunlu</FormLabel>
                        <FormDescription>
                          Ürün Sevk işlemi sırasında Seri Numarası istenir.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Kaydet</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewItem;
