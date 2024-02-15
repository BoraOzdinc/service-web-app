"use client";
import { useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
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
import { columns } from "./components/columns";
import { type ItemWithId, useUpdateItem } from "~/utils/useItems";

const ItemDetail = () => {
  const params = useParams<{ itemId: string }>();
  const itemId = params.itemId.replace(/%.*$/, "");
  const update = useUpdateItem();
  const { data: itemData, isLoading: isItemLoading } =
    api.items.getItemWithId.useQuery(itemId);

  //const storages = api.items.getStorages.useQuery();

  function onSubmitForm(data: FormInput) {
    update.mutate({ itemId: itemId, ...data });
  }
  if (isItemLoading) {
    return <Loader />;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Ürün Düzenle</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full gap-3">
        <div className="flex w-full flex-col gap-3 ">
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
          {itemData && (
            <DataTable
              pagination
              datePicker={{ columnToFilter: "createDate", title: "Tarih" }}
              data={itemData.ItemHistory}
              columns={columns}
            />
          )}
        </div>
        <div className="flex w-full flex-col">
          {itemData && (
            <ItemDetailForm itemData={itemData} onSubmitForm={onSubmitForm} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ItemDetailForm = ({
  itemData,
  onSubmitForm,
}: {
  itemData: ItemWithId;
  onSubmitForm: (data: FormInput) => void;
}) => {
  const { control, handleSubmit, formState } = useForm<FormInput>({
    defaultValues: {
      barcode: itemData.barcode,
      brand: itemData.brand,
      productName: itemData.name,
      dealerPrice: itemData.dealerPrice,
      mainDealerPrice: itemData.mainDealerPrice,
      multiPrice: itemData.multiPrice,
      serialNo: itemData.serialNo,
      singlePrice: itemData.singlePrice,
    },
  });
  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmitForm)}>
      <Button type="submit" disabled={!formState.isValid && !formState.isDirty}>
        Kaydet
      </Button>
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
            <Input
              disabled
              {...field}
              id="itemBarcode"
              placeholder="Ürün Barkodu"
            />
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
      {/* <div>
          <Label htmlFor="itemStorage">Depo</Label>
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
        </div> */}
      <div>
        <Label htmlFor="itemMainDealer">Anabayi Satış Fiyatı</Label>
        <Controller
          name="mainDealerPrice"
          rules={{ required: true }}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="itemMainDealer"
              type="number"
              step="0.01"
              placeholder=""
            />
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
            <Input
              {...field}
              id="itemMultiPrice"
              type="number"
              step="0.01"
              placeholder=""
            />
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
            <Input
              {...field}
              id="itemDealerPrice"
              type="number"
              step="0.01"
              placeholder=""
            />
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
            <Input
              {...field}
              id="itemSinglePrice"
              type="number"
              step="0.01"
              placeholder=""
            />
          )}
        />
      </div>
      {/* <div>
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
        </div> */}
    </form>
  );
};

export default ItemDetail;
