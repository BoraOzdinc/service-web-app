/* eslint-disable @next/next/no-img-element */
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
import { createClient } from "~/utils/supabase/client";
import toast from "react-hot-toast";
import cuid2 from "@paralleldrive/cuid2";
import { PERMS } from "~/_constants/perms";
import { useSession } from "~/utils/SessionProvider";
import { type SessionType } from "~/utils/getSession";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { DialogDescription } from "@radix-ui/react-dialog";
import OrderComponent from "~/app/_components/OrderComponent";
import { CircleX, Pencil } from "lucide-react";

const ItemDetail = () => {
  const supabase = createClient();
  const params = useParams<{ itemId: string }>();
  const itemId = params.itemId.replace(/%.*$/, "");
  const update = useUpdateItem();
  const addBarcode = useAddBarcode();
  const session = useSession();
  const [barcode, setBarcode] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [isMaster, setIsMaster] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [uploadedFile, setuploadedFile] = useState<File | undefined>(undefined);
  const utils = api.useUtils();
  const { data: itemData, isLoading: isItemLoading } =
    api.items.getItemWithId.useQuery(itemId);
  const handleFileUpload = async (): Promise<void> => {
    if (itemData?.itemDetails.isServiceItem) {
      toast.error("Bu ürün servis ürünüdür!");
      return;
    }
    if (!uploadedFile) {
      toast.error("Yüklemek için bir dosya seçmelisiniz!");
      return;
    }
    const { data: itemImage, error: imageError } = await supabase.storage
      .from("images")
      .upload(
        `private/${itemData?.itemDetails.orgId}/${cuid2.createId()}`,
        uploadedFile,
      );
    if (imageError) {
      toast.error("Failed to upload image:" + imageError.message);
      return;
    }
    const { data: itemImagePath } = supabase.storage
      .from("images")
      .getPublicUrl(itemImage.path);

    const { error: updateItemError } = await supabase
      .from("Item")
      .update({ image: itemImagePath.publicUrl })
      .eq("id", itemId)
      .select()
      .single();

    if (updateItemError) {
      toast.error("Failed to update item:" + updateItemError.message);
      return;
    }
    await utils.items.getItemWithId.invalidate();
    setuploadedFile(undefined);
  };
  async function onSubmitForm(data: FormInput) {
    update.mutate({ itemId: itemId, ...data });
  }

  if (isItemLoading) {
    return <Loader />;
  }
  return (
    <div className="flex w-full flex-col gap-3">
      <CardTitle>Ürün Detayları</CardTitle>

      <div className="flex w-full flex-col gap-3">
        <Card>
          <CardHeader>
            <CardTitle>Stoklar</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {itemData?.itemDetails?.ItemStock.length ? (
              itemData?.itemDetails?.ItemStock.map((i) => {
                return (
                  <div
                    key={i.id}
                    className="flex flex-row justify-between border border-black p-2"
                  >
                    <p>{i.Storage?.name}</p>
                    <p>{i.stock}</p>
                  </div>
                );
              })
            ) : (
              <p className=" text-xl font-semibold">Stok Bulunamadı!</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Barkodlar</CardTitle>
            {session?.permissions.includes(PERMS.manage_items) && (
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
                        Ana Barkod olarak seçtiğinizde ürün listesinde bu barkod
                        görünür.
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
                          orgId: itemData?.itemDetails?.orgId ?? "",
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
            )}
          </CardHeader>
          <CardContent className="overflow-scroll sm:overflow-hidden">
            <DataTable
              data={itemData?.itemDetails?.itemBarcode}
              columns={itemBarcodeColumns}
              isLoading={!itemData?.itemDetails?.itemBarcode}
            />
          </CardContent>
        </Card>
      </div>
      {itemData && !update.isLoading && (
        <>
          {!itemData.itemDetails.isServiceItem &&
            session?.permissions.includes(PERMS.manage_items) && (
              <div className="flex flex-col gap-3">
                {itemData.itemDetails.image && (
                  <PhotoProvider>
                    <PhotoView src={itemData.itemDetails.image}>
                      <img
                        src={itemData.itemDetails.image}
                        className="h-40 w-40"
                        alt=""
                      />
                    </PhotoView>
                  </PhotoProvider>
                )}
                <div className="flex w-full gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Görsel Yükle/Güncelle</Button>
                    </DialogTrigger>
                    <DialogContent onEscapeKeyDown={(e) => e.preventDefault()}>
                      <DialogHeader>
                        <DialogTitle>Görsel Yükle/Güncelle</DialogTitle>
                      </DialogHeader>

                      <Input
                        id="picture"
                        type="File"
                        onChange={(e) => {
                          if (e.target.files) {
                            setuploadedFile(e.target.files?.[0]);
                          }
                        }}
                      />
                      <Button
                        disabled={!uploadedFile}
                        onClick={async () => {
                          if (uploadedFile) {
                            await toast.promise(handleFileUpload(), {
                              error: "Bir Hata Oluştu!",
                              loading: "Yükleniyor",
                              success: "Başarılı!",
                            });
                          }
                        }}
                      >
                        Onayla
                      </Button>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Servis Ürünlerini Görüntüle</Button>
                    </DialogTrigger>
                    <DialogContent className="flex w-full min-w-min flex-col overflow-x-auto">
                      <DialogHeader>
                        <DialogTitle>Servis Ürünleri</DialogTitle>
                        <DialogDescription className="flex items-center gap-3">
                          Detayını Görmek İstediğiniz Ürüne Tıklayın
                          {editMode ? (
                            <CircleX
                              className="h-4 w-4"
                              onClick={() => {
                                setEditMode(!editMode);
                              }}
                            />
                          ) : (
                            <Pencil
                              className="h-4 w-4"
                              onClick={() => {
                                setEditMode(!editMode);
                              }}
                            />
                          )}
                        </DialogDescription>
                      </DialogHeader>
                      <OrderComponent
                        data={itemData?.serviceItems}
                        editMode={editMode}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
          {session && (
            <ItemDetailForm
              itemData={itemData}
              onSubmitForm={onSubmitForm}
              session={session}
            />
          )}
        </>
      )}
    </div>
  );
};

const ItemDetailForm = ({
  itemData,
  onSubmitForm,
  session,
}: {
  itemData: ItemWithId;
  onSubmitForm: (data: FormInput) => void;
  session: SessionType;
}) => {
  const form = useForm<FormInput>({
    defaultValues: {
      itemBrandId: itemData.itemDetails?.itemBrandId,
      productName: itemData.itemDetails?.name,
      dealerPrice: Number(itemData.itemDetails?.dealerPrice) ?? undefined,
      mainDealerPrice:
        Number(itemData.itemDetails?.mainDealerPrice) ?? undefined,
      multiPrice: Number(itemData.itemDetails?.multiPrice) ?? undefined,
      itemCode: itemData.itemDetails?.itemCode,
      singlePrice: Number(itemData.itemDetails?.singlePrice) ?? undefined,
      itemColorId: itemData.itemDetails?.itemColorId,
      itemCategoryId: itemData.itemDetails?.itemCategoryId,
      itemSizeId: itemData.itemDetails?.itemSizeId,
      netWeight: itemData.itemDetails?.netWeight ?? undefined,
      volume: itemData.itemDetails?.volume ?? undefined,
      isSerialNoRequired: itemData.itemDetails?.isSerialNoRequired,
      isServiceItem: itemData.itemDetails?.isServiceItem,
    },
    disabled: !session.permissions.includes(PERMS.manage_items),
  });

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
                      data={itemData.colors?.map((d) => ({
                        label: `${d.colorCode} ${d.colorText}`,
                        value: d.id,
                      }))}
                      name={field.name}
                      onChange={field.onChange}
                      value={field.value}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
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
                      data={itemData.sizes?.map((d) => ({
                        label: `${d.sizeCode} ${d.sizeText}`,
                        value: d.id,
                      }))}
                      name={field.name}
                      onChange={field.onChange}
                      value={field.value}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
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
                      data={itemData.categories?.map((d) => ({
                        label: d.name,
                        value: d.id,
                      }))}
                      name={field.name}
                      onChange={field.onChange}
                      value={field.value}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
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
                      data={itemData.brands?.map((d) => ({
                        label: d.name,
                        value: d.id,
                      }))}
                      name={field.name}
                      onChange={field.onChange}
                      value={field.value}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                        field.onChange(Number(e.target.value));
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
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
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
                      disabled={field.disabled}
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
                      disabled={field.disabled}
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
          {session.permissions.includes(PERMS.manage_items) && (
            <Button
              disabled={!form.formState.isDirty || !form.formState.isValid}
              type="submit"
            >
              Kaydet
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default ItemDetail;
