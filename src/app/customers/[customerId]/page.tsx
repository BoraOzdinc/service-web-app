"use client";
import { $Enums } from "@prisma/client";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { AddressTypes, PriceTypes } from "~/_constants";
import Loader from "~/app/_components/loader";
import { DataTable } from "~/app/_components/tables/generic-table";
import { Badge } from "~/app/_components/ui/badge";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import { ScrollArea } from "~/app/_components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/ui/tabs";
import { Textarea } from "~/app/_components/ui/textarea";
import { api } from "~/trpc/server";
import {
  useAddAddress,
  useDeleteAddress,
  useUpdateAddress,
  useUpdateCustomer,
  type customerById,
} from "~/utils/useCustomers";
import { customerTransactionColumns } from "./components/customerTransactionColumns";

interface FormInput {
  companyName: string;
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
  identificationNo: string;
  priceType: string;
  connectedDealerId: string;
  taxDep: string;
  taxNumber: string;
}

interface AddOrUpdateAddressFormInput {
  PhoneNumber: string;
  Country: string;
  Province: string;
  District: string;
  Neighbour: string;
  ZipCode: string;
  Adress: string;
  Type: $Enums.AdressType;
}

const CustomerDetail = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const { data: customer, isLoading } =
    api.customer.getCustomerWithId.useQuery(customerId);
  const { data: customerTransactions } =
    api.customer.getCustomerTransactions.useQuery(customerId);
  const { data: session } = api.utilRouter.getSession.useQuery();

  const updateCustomer = useUpdateCustomer();

  const onSubmitForm = (data: FormInput) => {
    if (customer) {
      updateCustomer.mutate({ ...data, customerId: customer.id });
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle>Müşteri Detayları</CardTitle>
      </CardHeader>
      <Tabs defaultValue="details" className="flex w-full flex-col">
        <TabsList className="w-full">
          <TabsTrigger value="details">Müşteri</TabsTrigger>
          <TabsTrigger value="purchases">Satın Alımlar</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Card className="sm:col-span-2">
              {customer && !updateCustomer.isLoading ? (
                <CustomerDetailForm
                  customer={customer}
                  onSubmitForm={onSubmitForm}
                  session={session}
                />
              ) : null}
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Adresler</CardTitle>
                  <CardDescription>
                    Düzenlemek istediğiniz adrese basın.
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Yeni Adres</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <AddOrUpdateAddressForm customerId={customerId} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-2">
                <ScrollArea className="h-[250px] w-full rounded-md border p-2">
                  {customer?.adresses.map((a) => {
                    return (
                      <Dialog key={a.id}>
                        <DialogTrigger asChild>
                          <div className="mb-1 flex cursor-pointer flex-row items-center justify-between rounded-md border p-2 transition-colors hover:bg-accent hover:text-accent-foreground">
                            <div className=" flex flex-col items-start justify-center  ">
                              <CardDescription>{`${a.Neighbour} Mahallesi, ${a.Adress}, ${a.ZipCode}`}</CardDescription>
                              <CardDescription>{`${a.District} / ${a.Province}, ${a.Country}`}</CardDescription>
                            </div>
                            <Badge>{AddressTypes[a.Type]}</Badge>
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <AddOrUpdateAddressForm
                            customerId={customerId}
                            address={a}
                          />
                        </DialogContent>
                      </Dialog>
                    );
                  })}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Müşteri Carisi</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={customerTransactions ?? []}
                columns={customerTransactionColumns}
                columnFilter={[
                  {
                    columnToFilter: "transactionType",
                    title: "Satış Tipi",
                    options: [
                      { label: "Satış", value: "Sale" },
                      { label: "İptal", value: "Cancel" },
                      { label: "İade", value: "Return" },
                    ],
                  },
                ]}
                datePicker={{ columnToFilter: "createDate", title: "Tarih" }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AddOrUpdateAddressForm = ({
  address,
  customerId,
}: {
  customerId: string;
  address?: {
    id: string;
    Type: $Enums.AdressType;
    PhoneNumber: string | null;
    Country: string | null;
    Province: string | null;
    District: string | null;
    Neighbour: string | null;
    ZipCode: string | null;
    Adress: string | null;
    customerId: string | null;
  };
}) => {
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAdress = useDeleteAddress();
  const form = useForm<AddOrUpdateAddressFormInput>({
    defaultValues: {
      Adress: address?.Adress ?? undefined,
      Country: address?.Country ?? undefined,
      District: address?.District ?? undefined,
      Neighbour: address?.Neighbour ?? undefined,
      PhoneNumber: address?.PhoneNumber ?? undefined,
      Province: address?.Province ?? undefined,
      Type: address?.Type ?? $Enums.AdressType.Normal,
      ZipCode: address?.ZipCode ?? undefined,
    },
  });

  const onSubmitForm = (data: AddOrUpdateAddressFormInput) => {
    if (address) {
      updateAddress.mutate({ ...data, customerId, addressId: address.id });
    } else {
      addAddress.mutate({ ...data, customerId });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitForm)}
        className=" grid grid-cols-1 gap-3 md:grid-cols-2"
      >
        <FormField
          name="Type"
          control={form.control}
          rules={{ required: true }}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Adres Tipi*</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    name={field.name}
                    value={String(field.value)}
                  >
                    <SelectTrigger
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      ref={field.ref}
                      id="addressType"
                    >
                      <SelectValue placeholder="Tip Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(AddressTypes).map((a, i) => (
                        <SelectItem key={i} value={a}>
                          {AddressTypes[a as keyof typeof AddressTypes]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name="PhoneNumber"
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
          name="Country"
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
          name="Province"
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
          name="District"
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
          name="Neighbour"
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
          name="ZipCode"
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
          name="Adress"
          control={form.control}
          rules={{ required: true, maxLength: 500 }}
          render={({ field }) => (
            <FormItem className="col-span-1 sm:col-span-2">
              <FormLabel>Adres*</FormLabel>
              <FormControl>
                <Textarea placeholder="Adres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogClose asChild>
          <Button
            disabled={!form.formState.isValid || !form.formState.isDirty}
            type="submit"
            className="col-span-1 sm:col-span-2"
          >
            Kaydet
          </Button>
        </DialogClose>
        {address && (
          <DialogClose asChild>
            <Button
              variant={"destructive"}
              type="button"
              className="col-span-1 sm:col-span-2"
              onClick={() => deleteAdress.mutate(address.id)}
            >
              Sil
            </Button>
          </DialogClose>
        )}
      </form>
    </Form>
  );
};

const CustomerDetailForm = ({
  session,
  customer,
  onSubmitForm,
}: {
  session:
    | {
        permissions: string[];
        orgId: string | null | undefined;
        dealerId: string | null | undefined;
        email: string | undefined;
      }
    | undefined;
  customer: customerById;
  onSubmitForm: (data: FormInput) => void;
}) => {
  const dealers = api.dealer.getDealers.useQuery(undefined, {
    enabled: Boolean(session?.orgId),
  });
  const form = useForm<FormInput>({
    defaultValues: {
      companyName: customer?.companyName ?? undefined,
      connectedDealerId: customer?.connectedDealerId ?? undefined,
      email: customer?.email,
      identificationNo: customer?.identificationNo ?? undefined,
      name: customer?.name,
      phoneNumber: customer?.phoneNumber,
      priceType: customer?.priceType,
      surname: customer?.surname,
      taxDep: customer?.taxDep ?? undefined,
      taxNumber: customer?.taxNumber ?? undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Müşteri</CardTitle>
          <Button
            disabled={!form.formState.isValid || !form.formState.isDirty}
            type="submit"
          >
            Kaydet
          </Button>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </form>
    </Form>
  );
};

export default CustomerDetail;
