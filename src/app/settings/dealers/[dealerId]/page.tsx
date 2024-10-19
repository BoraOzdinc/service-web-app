/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";
import { useParams } from "next/navigation";
import { DataTable } from "~/app/_components/tables/generic-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { api } from "~/trpc/server";
import { columns as dealerMemberColumns } from "./components/dealerMemberColumns";
import { columns as dealerItemsColumns } from "./components/dealerItemsColumns";
import {
  RoleCreateOrUpdateModal,
  columns as dealerRolesColumns,
} from "./components/dealerRolesColumn";
import { Button } from "~/app/_components/ui/button";
import { PERMS } from "~/_constants/perms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { useCreateDealerMember } from "~/utils/useDealer";
import { useMemo, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/ui/tabs";
import {
  Layers3Icon,
  Loader2Icon,
  PaletteIcon,
  RulerIcon,
  TagsIcon,
  WarehouseIcon,
} from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { isValidEmail } from "~/utils";
import { dealerTransactionsColumns } from "./components/dealerTransactionsColumns";
import { useSession } from "~/utils/SessionProvider";

const DealerDetails = () => {
  const params = useParams<{ dealerId: string }>();
  const session = useSession();
  const addDealerMember = useCreateDealerMember();
  const [dealerMemberEmail, setDealerMemberEmail] = useState<
    string | undefined
  >();
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearchInput = useDebounce(searchInput, 750);
  const dealerMembers = api.dealer.getDealerMembers.useQuery(params.dealerId, {
    enabled: session?.permissions.includes(PERMS.view_dealer_members),
  });
  const dealerRoles = api.dealer.getDealerRoles.useQuery(params.dealerId, {
    enabled: session?.permissions.includes(PERMS.view_dealer_role),
  });
  const { data, isLoading } = api.items.getItems.useQuery({
    orgId: session?.orgId ?? undefined,
    dealerId: params.dealerId,
    searchInput: debouncedSearchInput,
  });
  const dealerItems = useMemo(() => {
    if (data) {
      return data
        .filter(
          (o) =>
            (o.itemBarcode.find((b) =>
              b.barcode
                .toLowerCase()
                .includes(debouncedSearchInput.toLowerCase()),
            ) ??
              o.itemCode
                .toLowerCase()
                .includes(debouncedSearchInput.toLowerCase())) ||
            o.name.toLowerCase().includes(debouncedSearchInput.toLowerCase()),
        )
        .map((o) => {
          const totalStock = o.ItemStock.reduce((sum, s) => sum + s.stock, 0);
          return { ...o, totalStock };
        })
        .sort((a, b) => b.totalStock - a.totalStock);
    }
    return [];
  }, [data, debouncedSearchInput]);

  const dealerTransactions = api.dealer.getDealerTransactions.useQuery(
    params.dealerId,
    { enabled: session?.permissions.includes(PERMS.dealers_view) },
  );
  const memberColumns = useMemo(() => {
    return dealerMemberColumns(dealerRoles.data);
  }, [dealerRoles]);
  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle>{dealerMembers.data?.[0]?.org?.name}</CardTitle>
      </CardHeader>
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="w-full">
          {
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            (session?.permissions.includes(PERMS.view_dealer_members) ||
              session?.permissions.includes(PERMS.view_dealer_role)) && (
              <TabsTrigger value="members">Üyeler ve Roller</TabsTrigger>
            )
          }
          {session?.orgId &&
            session?.permissions.includes(PERMS.dealer_item_view) && (
              <TabsTrigger value="items">Ürünler</TabsTrigger>
            )}
          {session?.permissions.includes(PERMS.dealers_view) && (
            <TabsTrigger value="customerHistory">Müşteri Geçmişi</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="members">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {session?.permissions.includes(PERMS.view_dealer_members) && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className=" flex flex-row gap-3">
                    <CardTitle>Bayii Üyeleri</CardTitle>
                    {dealerMembers.isLoading && (
                      <Loader2Icon className="h-5 w-5 animate-spin" />
                    )}
                  </div>
                  {session?.permissions.includes(
                    PERMS.manage_dealer_members,
                  ) ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Üye Ekle</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Yeni üye</DialogTitle>
                        </DialogHeader>
                        <Label>E-Mail</Label>
                        <Input
                          placeholder="E-Mail"
                          inputMode="email"
                          value={dealerMemberEmail}
                          onChange={(e) => {
                            setDealerMemberEmail(e.target.value);
                          }}
                        />
                        <Button
                          disabled={
                            isValidEmail(dealerMemberEmail) ||
                            !dealerMemberEmail
                          }
                          onClick={() =>
                            dealerMemberEmail &&
                            addDealerMember.mutate({
                              orgId: params.dealerId,
                              email: dealerMemberEmail,
                            })
                          }
                        >
                          Üyeyi Ekle
                        </Button>
                        <DialogDescription>
                          Not: Üyenin eklenebilmesi için daha önce sisteme giriş
                          yapmış olması gerekmektedir.
                        </DialogDescription>
                      </DialogContent>
                    </Dialog>
                  ) : null}
                </CardHeader>
                <CardContent className="overflow-x-scroll md:overflow-x-hidden">
                  <DataTable
                    data={dealerMembers.data}
                    isLoading={dealerMembers.isLoading}
                    columns={memberColumns}
                    pagination
                  />
                </CardContent>
              </Card>
            )}
            {session?.permissions.includes(PERMS.view_dealer_role) && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className=" flex flex-row gap-3">
                    <CardTitle>Bayii Rolleri</CardTitle>
                    {dealerRoles.isLoading && (
                      <Loader2Icon className="h-5 w-5 animate-spin" />
                    )}
                  </div>

                  {session.permissions.includes(PERMS.manage_dealer_role) && (
                    <RoleCreateOrUpdateModal
                      dealerId={params.dealerId}
                      mode="create"
                      permissions={[]}
                      roleId=""
                      roleName=""
                    />
                  )}
                </CardHeader>
                <CardContent className="overflow-x-scroll md:overflow-x-hidden">
                  <DataTable
                    data={dealerRoles.data}
                    isLoading={dealerRoles.isLoading}
                    columns={dealerRolesColumns}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        {session?.orgId &&
          session?.permissions.includes(PERMS.dealer_item_view) && (
            <TabsContent value="items">
              <Card>
                <CardHeader>
                  <CardTitle>Ürünler</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-scroll md:overflow-x-hidden">
                  <DataTable
                    data={dealerItems}
                    columns={dealerItemsColumns}
                    isLoading={isLoading}
                    columnFilter={[
                      {
                        columnToFilter: "itemBrandId",
                        title: "Marka",
                        options: [
                          ...new Set(
                            dealerItems?.flatMap((i) => i.ItemBrand?.name),
                          ),
                        ].map((b) => ({
                          label: b ?? "",
                          value: b ?? "",
                        })),
                        icon: <TagsIcon className="mr-2 h-5 w-5" />,
                      },
                      {
                        columnToFilter: "itemColorId",
                        title: "Renk",
                        options: [
                          ...new Set(
                            dealerItems?.flatMap((i) => i.ItemColor?.colorCode),
                          ),
                        ].map((b) => ({
                          label: b ?? "",
                          value: b ?? "",
                        })),
                        icon: <PaletteIcon className="mr-2 h-5 w-5" />,
                      },
                      {
                        columnToFilter: "itemSizeId",
                        title: "Beden",
                        options: [
                          ...new Set(
                            dealerItems?.flatMap((i) => i.ItemSize?.sizeCode),
                          ),
                        ].map((b) => ({
                          label: b ?? "",
                          value: b ?? "",
                        })),
                        icon: <RulerIcon className="mr-2 h-5 w-5" />,
                      },
                      {
                        columnToFilter: "itemCategoryId",
                        title: "Kategori",
                        options: [
                          ...new Set(
                            dealerItems?.flatMap((i) => i.ItemCategory?.name),
                          ),
                        ].map((b) => ({
                          label: b ?? "",
                          value: b ?? "",
                        })),
                        icon: <Layers3Icon className="mr-2 h-5 w-5" />,
                      },
                      {
                        columnToFilter: "totalStock",
                        title: "Depo",
                        options: [
                          ...new Map(
                            dealerItems
                              ?.flatMap((item) =>
                                item.ItemStock.flatMap(
                                  (stock) => stock.Storage,
                                ).filter(Boolean),
                              )
                              .map((storage) => [storage?.id, storage]),
                          ).values(),
                        ].map((c) => ({
                          label: c?.name ?? "",
                          value: c?.id ?? "",
                        })),
                        icon: <WarehouseIcon className="mr-2 h-5 w-5" />,
                      },
                    ]}
                    serverSearch={{
                      setState: setSearchInput,
                      state: searchInput,
                      title: "kod, barkod, isim",
                    }}
                    pagination
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        {session?.permissions.includes(PERMS.dealers_view) && (
          <TabsContent value={"customerHistory"}>
            <Card>
              <CardHeader>
                <CardTitle>Bayii Müşterileri Geçmişi</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={dealerTransactions.data}
                  columns={dealerTransactionsColumns}
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
        )}
      </Tabs>
    </div>
  );
};

export default DealerDetails;
