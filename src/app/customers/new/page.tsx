"use client";
import { $Enums } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PriceTypes } from "~/_constants";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { Checkbox } from "~/app/_components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import { Separator } from "~/app/_components/ui/separator";
import { Textarea } from "~/app/_components/ui/textarea";
import { api } from "~/trpc/server";
import { getSession } from "~/utils/getSession";
import { useCreateCustomer } from "~/utils/useCustomers";

interface FormInput {
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
  identificationNo: string;

  companyName: string;
  taxDep: string;
  taxNumber: string;

  adresses: {
    PhoneNumber: string;
    Country: string;
    Province: string;
    District: string;
    Neighbour: string;
    ZipCode: string;
    Adress: string;
    Type: $Enums.AdressType;
  }[];

  connectedDealerId: string;
  priceType: string;
}

const NewCustomer = () => {
  const { data: session } = useQuery({ queryFn: getSession });
  const [useAsBill, setUseAsBill] = useState<boolean>(true);
  const form = useForm<FormInput>({
    defaultValues: { adresses: undefined },
  });
  const dealers = api.dealer.getDealers.useQuery(undefined, {
    enabled: Boolean(session?.orgId),
  });
  const addCustomer = useCreateCustomer();

  function onSubmitForm(data: FormInput) {
    if (useAsBill) {
      if (data.adresses[0]?.Adress) {
        data.adresses[0].Type = $Enums.AdressType.Normal;
        data.adresses[1] = {
          ...data.adresses[0],
          Type: $Enums.AdressType.Billing,
        };
      }
    } else {
      if (data.adresses[0]?.Adress) {
        data.adresses[0].Type = $Enums.AdressType.Normal;
      }
      if (data.adresses[1]?.Adress) {
        data.adresses[1].Type = $Enums.AdressType.Billing;
      }
    }

    addCustomer.mutate(data);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Yeni Müşteri</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)}>
            <div className="flex w-full flex-col gap-3">
              <div className=" grid grid-cols-1 gap-3 md:grid-cols-4">
                <FormField
                  name="companyName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Şirket</FormLabel>
                      <FormControl>
                        <Input placeholder="Şirket" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="name"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Müşteri İsmi*</FormLabel>
                      <FormControl>
                        <Input placeholder="İsim" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="surname"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Müşteri Soyismi*</FormLabel>
                      <FormControl>
                        <Input placeholder="Soyisim" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="phoneNumber"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon Numarası*</FormLabel>
                      <FormControl>
                        <Input placeholder="Telefon Numarası" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-Mail*</FormLabel>
                      <FormControl>
                        <Input placeholder="E-Mail" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="identificationNo"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kimlik Numarası</FormLabel>
                      <FormControl>
                        <Input placeholder="Kimlik" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {session?.orgId ? (
                  <FormField
                    name="connectedDealerId"
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Bağlı Bayii</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              name={field.name}
                              value={field.value}
                              disabled={dealers.isLoading}
                            >
                              <SelectTrigger
                                onBlur={field.onBlur}
                                disabled={field.disabled}
                                ref={field.ref}
                                id="itemStorage"
                              >
                                <SelectValue placeholder="Bayii Seçiniz" />
                              </SelectTrigger>
                              <SelectContent>
                                {dealers.data?.map((s) => {
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
                      );
                    }}
                  />
                ) : null}
                <FormField
                  name="priceType"
                  rules={{ required: true }}
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Fiyat Tipi*</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            name={field.name}
                            value={field.value}
                          >
                            <SelectTrigger
                              onBlur={field.onBlur}
                              disabled={field.disabled}
                              ref={field.ref}
                              id="itemStorage"
                            >
                              <SelectValue placeholder="Tip Seçiniz" />
                            </SelectTrigger>
                            <SelectContent>
                              {PriceTypes.map((s) => {
                                return (
                                  <SelectItem key={s.value} value={s.value}>
                                    {s.label}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  name="taxDep"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vergi Dairesi</FormLabel>
                      <FormControl>
                        <Input placeholder="Vergi Daire" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="taxNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vergi Numarası</FormLabel>
                      <FormControl>
                        <Input placeholder="Vergi Numarası" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="text-xl font-semibold">Adres</div>
              <Separator />
              <div className=" grid grid-cols-1 gap-3 md:grid-cols-4">
                <FormField
                  name="adresses.0.PhoneNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon Numarası</FormLabel>
                      <FormControl>
                        <Input placeholder="Telefon Numarası" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="adresses.0.Country"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ülke</FormLabel>
                      <FormControl>
                        <Input placeholder="Ülke" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="adresses.0.Province"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İl</FormLabel>
                      <FormControl>
                        <Input placeholder="İl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="adresses.0.District"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İlçe</FormLabel>
                      <FormControl>
                        <Input placeholder="İlçe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="adresses.0.Neighbour"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mahalle</FormLabel>
                      <FormControl>
                        <Input placeholder="Mahalle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="adresses.0.ZipCode"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Posta Kodu</FormLabel>
                      <FormControl>
                        <Input placeholder="Posta Kodu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="adresses.0.Adress"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Adres</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Adres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row  items-center space-x-3 space-y-0 rounded-md border p-4">
                  <Checkbox
                    checked={useAsBill}
                    onCheckedChange={() => setUseAsBill(!useAsBill)}
                  />
                  <p>Fatura Adresi Olarak Kullan</p>
                </div>
              </div>
              {useAsBill ? null : (
                <>
                  <div className="text-xl font-semibold">Fatura Adresi</div>
                  <Separator />
                  <div className=" grid grid-cols-1 gap-3 md:grid-cols-4">
                    <FormField
                      name="adresses.1.PhoneNumber"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon Numarası</FormLabel>
                          <FormControl>
                            <Input placeholder="Telefon Numarası" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="adresses.1.Country"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ülke</FormLabel>
                          <FormControl>
                            <Input placeholder="Ülke" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="adresses.1.Province"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>İl</FormLabel>
                          <FormControl>
                            <Input placeholder="İl" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="adresses.1.District"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>İlçe</FormLabel>
                          <FormControl>
                            <Input placeholder="İlçe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="adresses.1.Neighbour"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mahalle</FormLabel>
                          <FormControl>
                            <Input placeholder="Mahalle" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="adresses.1.ZipCode"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Posta Kodu</FormLabel>
                          <FormControl>
                            <Input placeholder="Posta Kodu" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="adresses.1.Adress"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Adres</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Adres" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              <Button disabled={!form.formState.isValid} type="submit">
                Kaydet
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewCustomer;
