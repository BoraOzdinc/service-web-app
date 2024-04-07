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
import { useSession } from "next-auth/react";
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
} from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { isValidEmail } from "~/utils";

const DealerDetails = () => {
  const params = useParams<{ dealerId: string }>();
  const { data: session } = useSession();
  const addDealerMember = useCreateDealerMember();
  const [dealerMemberEmail, setDealerMemberEmail] = useState<
    string | undefined
  >();
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearchInput = useDebounce(searchInput, 750);
  const dealerMembers = api.dealer.getDealerMembers.useQuery(params.dealerId, {
    enabled: session?.user.permissions.includes(PERMS.view_dealer_members),
  });
  const dealerRoles = api.dealer.getDealerRoles.useQuery(params.dealerId, {
    enabled: session?.user.permissions.includes(PERMS.view_dealer_role),
  });
  const dealerItems = api.items.getItems.useQuery(
    {
      dealerId: params.dealerId,
      orgId: undefined,
      searchInput: debouncedSearchInput,
    },
    {
      enabled:
        (!!session?.user.orgId &&
          session?.user.permissions.includes(PERMS.dealer_item_view)) ||
        (!!session?.user.dealerId &&
          session?.user.permissions.includes(PERMS.item_view)),
    },
  );

  const memberColumns = useMemo(() => {
    return dealerMemberColumns(dealerRoles.data);
  }, [dealerRoles]);

  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle>{dealerMembers.data?.[0]?.dealer.name}</CardTitle>
      </CardHeader>
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="w-full">
          {
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            (session?.user.permissions.includes(PERMS.view_dealer_members) ||
              session?.user.permissions.includes(PERMS.view_dealer_role)) && (
              <TabsTrigger value="members">Üyeler ve Roller</TabsTrigger>
            )
          }
          {((session?.user.orgId &&
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            session?.user.permissions.includes(PERMS.dealer_item_view)) ||
            (session?.user.dealerId &&
              session?.user.permissions.includes(PERMS.item_view))) && (
            <TabsTrigger value="items">Ürünler</TabsTrigger>
          )}
          <TabsTrigger value="history">Geçmiş</TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {session?.user.permissions.includes(PERMS.view_dealer_members) && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className=" flex flex-row gap-3">
                    <CardTitle>Bayii Üyeleri</CardTitle>
                    {dealerMembers.isLoading && (
                      <Loader2Icon className="h-5 w-5 animate-spin" />
                    )}
                  </div>
                  {session?.user.permissions.includes(
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
                              email: dealerMemberEmail,
                              dealerId: params.dealerId,
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
                    columns={memberColumns ?? []}
                    pagination
                  />
                </CardContent>
              </Card>
            )}
            {session?.user.permissions.includes(PERMS.view_dealer_role) && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className=" flex flex-row gap-3">
                    <CardTitle>Bayii Rolleri</CardTitle>
                    {dealerRoles.isLoading && (
                      <Loader2Icon className="h-5 w-5 animate-spin" />
                    )}
                  </div>

                  {session.user.permissions.includes(
                    PERMS.manage_dealer_role,
                  ) && (
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
                    columns={dealerRolesColumns}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        {((session?.user.orgId &&
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          session?.user.permissions.includes(PERMS.dealer_item_view)) ||
          (session?.user.dealerId &&
            session?.user.permissions.includes(PERMS.item_view))) && (
          <TabsContent value="items">
            <Card>
              <CardHeader>
                <CardTitle>Ürünler</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-scroll md:overflow-x-hidden">
                <DataTable
                  data={dealerItems.data}
                  columns={dealerItemsColumns}
                  columnFilter={[
                    {
                      columnToFilter: "itemBrandId",
                      title: "Marka",
                      options: [
                        ...new Set(dealerItems.data?.flatMap((i) => i.brand)),
                      ].map((b) => ({
                        label: b.name,
                        value: b.id,
                      })),
                      icon: <TagsIcon className="mr-2 h-5 w-5" />,
                    },
                    {
                      columnToFilter: "itemColorId",
                      title: "Renk",
                      options: [
                        ...new Set(dealerItems.data?.flatMap((i) => i.color)),
                      ].map((b) => ({
                        label: b.colorCode,
                        value: b.id,
                      })),
                      icon: <PaletteIcon className="mr-2 h-5 w-5" />,
                    },
                    {
                      columnToFilter: "itemSizeId",
                      title: "Beden",
                      options: [
                        ...new Set(dealerItems.data?.flatMap((i) => i.size)),
                      ].map((b) => ({
                        label: b.sizeCode,
                        value: b.id,
                      })),
                      icon: <RulerIcon className="mr-2 h-5 w-5" />,
                    },
                    {
                      columnToFilter: "itemCategoryId",
                      title: "Kategori",
                      options: [
                        ...new Set(
                          dealerItems.data?.flatMap((i) => i.category),
                        ),
                      ].map((b) => ({
                        label: b.name,
                        value: b.id,
                      })),
                      icon: <Layers3Icon className="mr-2 h-5 w-5" />,
                    },
                  ]}
                  serverSearch={{
                    setState: setSearchInput,
                    state: searchInput,
                    title: "kod, barkod, isim",
                    isLoading: dealerItems.isLoading,
                  }}
                  pagination
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
        <TabsContent value={"history"}>
          <p>Work In Progress</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DealerDetails;
