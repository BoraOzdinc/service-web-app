"use client";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Loader from "~/app/_components/loader";
import { api } from "~/trpc/server";
import { type FormInput } from "../new-item/page";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { Label } from "~/app/_components/ui/label";
import { Input } from "~/app/_components/ui/input";

import { Button } from "~/app/_components/ui/button";

import { DataTable } from "~/app/_components/tables/generic-table";
import { columns as historyColumns } from "./components/columns";
import {
  type ItemWithId,
  useUpdateItem,
  useAddBarcode,
} from "~/utils/useItems";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import ComboBox from "~/app/_components/ComboBox";
import { Checkbox } from "~/app/_components/ui/checkbox";
import { columns as itemBarcodeColumns } from "./components/itemBarcodeColumns";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/ui/tabs";

const ItemDetail = () => {
  const params = useParams<{ itemId: string }>();
  const itemId = params.itemId.replace(/%.*$/, "");
  const update = useUpdateItem();
  const addBarcode = useAddBarcode();

  const [barcode, setBarcode] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [isMaster, setIsMaster] = useState<boolean>(false);

  const { data: itemData, isLoading: isItemLoading } =
    api.items.getItemWithId.useQuery(itemId);

  async function onSubmitForm(data: FormInput) {
    update.mutate({ itemId: itemId, ...data });
  }

  if (isItemLoading) {
    return <Loader />;
  }
  return (
    <div className="flex w-full flex-col gap-3">
      <CardTitle>Ürün Detayları</CardTitle>
      <Tabs defaultValue="item_details">
        <TabsList className="w-full">
          <TabsTrigger value="item_details">Ürün Detayları</TabsTrigger>
          <TabsTrigger value="item_history">Ürün Geçmişi</TabsTrigger>
        </TabsList>
        <TabsContent value="item_details" className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Stoklar</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {itemData?.ItemStock.map((i) => {
                  return (
                    <div
                      key={i.id}
                      className="flex flex-row justify-between border border-black p-2"
                    >
                      <p>{i.storage.name}</p>
                      <p>{i.stock}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Barkodlar</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Barkod Ekle</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Yeni Barkod</DialogTitle>
                    </DialogHeader>
                    <div>
                      <Label>Barkod</Label>
                      <Input
                        value={barcode}
                        onChange={(a) => {
                          setBarcode(a.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Birim</Label>
                      <Input
                        value={unit}
                        onChange={(a) => {
                          setUnit(a.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Bir Birimdeki Adet</Label>
                      <Input
                        value={quantity}
                        type="number"
                        onChange={(a) => {
                          setQuantity(a.target.value);
                        }}
                      />
                    </div>
                    <div className="items-top flex space-x-2">
                      <Checkbox
                        id="isMaster"
                        onClick={() => {
                          setIsMaster(!isMaster);
                        }}
                        checked={isMaster}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="isMaster"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Ana Barkod
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Ana Barkod olarak seçtiğinizde ürün listesinde bu
                          barkod görünür.
                        </p>
                      </div>
                    </div>
                    <DialogClose asChild>
                      <Button
                        isLoading={addBarcode.isLoading}
                        disabled={
                          barcode.length < 1 ||
                          quantity.length < 1 ||
                          unit.length < 1
                        }
                        onClick={() => {
                          addBarcode.mutate({
                            barcode: barcode,
                            quantity: quantity,
                            unit: unit,
                            isMaster: isMaster,
                            itemId: itemId,
                          });
                        }}
                      >
                        Onayla
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="overflow-scroll sm:overflow-hidden">
                <DataTable
                  data={itemData?.itemBarcode}
                  columns={itemBarcodeColumns}
                  isLoading={!itemData?.itemBarcode}
                />
              </CardContent>
            </Card>
          </div>
          {itemData && !update.isLoading && (
            <ItemDetailForm itemData={itemData} onSubmitForm={onSubmitForm} />
          )}
        </TabsContent>
        <TabsContent value="item_history">
          <DataTable
            pagination
            datePicker={{ columnToFilter: "createDate", title: "Tarih" }}
            data={itemData?.ItemHistory}
            columns={historyColumns}
            isLoading={!itemData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ItemDetailForm = ({
  itemData,
  onSubmitForm,
}: {
  itemData: ItemWithId;
  onSubmitForm: (data: FormInput) => void;
}) => {
  const colors = api.items.getColors.useQuery();
  const sizes = api.items.getSizes.useQuery();
  const categories = api.items.getCategory.useQuery();
  const brands = api.items.getBrands.useQuery();
  const form = useForm<FormInput>({
    defaultValues: {
      itemBrandId: itemData?.brand.id,
      productName: itemData?.name,
      dealerPrice: itemData?.dealerPrice ?? undefined,
      mainDealerPrice: itemData?.mainDealerPrice ?? undefined,
      multiPrice: itemData?.multiPrice ?? undefined,
      itemCode: itemData?.itemCode,
      singlePrice: itemData?.singlePrice ?? undefined,
      itemColorId: itemData?.itemColorId,
      itemCategoryId: itemData?.itemCategoryId,
      itemSizeId: itemData?.itemSizeId,
      netWeight: itemData?.netWeight ?? undefined,
      volume: itemData?.volume ?? undefined,
      isSerialNoRequired: itemData?.isSerialNoRequired,
      isServiceItem: itemData?.isServiceItem,
    },
  });
  itemData;

  return (
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
                  <FormLabel>Ürün İsmi*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ürün" {...field} />
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
                  <FormLabel>Ürün Kodu*</FormLabel>
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
                  <FormLabel>Ürün Rengi*</FormLabel>
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
                  <FormLabel>Ürün Bedeni*</FormLabel>
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
                  <FormLabel>Ürün Kategorisi*</FormLabel>
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
                  <FormLabel>Ürün Markası*</FormLabel>
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
              name="mainDealerPrice"
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
            <FormField
              name="description"
              control={form.control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Ürün güncellemesini neden yapıyorsunuz?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={!form.formState.isDirty || !form.formState.isValid}
            type="submit"
          >
            Kaydet
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ItemDetail;
