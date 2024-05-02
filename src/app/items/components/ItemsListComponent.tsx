"use client";
import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";
import { DataTable } from "~/app/_components/tables/generic-table";
import { api } from "~/trpc/server";
import { columns } from "./columns";
import {
  Layers3Icon,
  PaletteIcon,
  RulerIcon,
  TagsIcon,
  WarehouseIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/app/_components/ui/button";

const MainItemsList = ({
  session,
}: {
  session: {
    permissions: string[];
    orgId: string | null | undefined;
    dealerId: string | null | undefined;
    email: string | undefined;
  };
}) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearchInput = useDebounce(searchInput, 750);
  const ItemsData = api.items.getItems.useQuery(
    {
      orgId: session?.orgId ?? undefined,
      dealerId: session?.dealerId ?? undefined,
      searchInput: debouncedSearchInput,
    },
    { enabled: Boolean(session) },
  );
  const router = useRouter();
  return (
    <DataTable
      data={ItemsData.data}
      columns={columns}
      isLoading={ItemsData.isLoading}
      columnFilter={[
        {
          columnToFilter: "itemBrandId",
          title: "Marka",
          options: [
            ...new Set(ItemsData.data?.flatMap((i) => i.brand.name)),
          ].map((b) => ({
            label: b,
            value: b,
          })),
          icon: <TagsIcon className="mr-2 h-5 w-5" />,
        },
        {
          columnToFilter: "itemColorId",
          title: "Renk",
          options: [
            ...new Set(ItemsData.data?.flatMap((i) => i.color.colorCode)),
          ].map((b) => ({
            label: b,
            value: b,
          })),
          icon: <PaletteIcon className="mr-2 h-5 w-5" />,
        },
        {
          columnToFilter: "itemSizeId",
          title: "Beden",
          options: [
            ...new Set(ItemsData.data?.flatMap((i) => i.size.sizeCode)),
          ].map((b) => ({
            label: b,
            value: b,
          })),
          icon: <RulerIcon className="mr-2 h-5 w-5" />,
        },
        {
          columnToFilter: "itemCategoryId",
          title: "Kategori",
          options: [
            ...new Set(ItemsData.data?.flatMap((i) => i.category.name)),
          ].map((b) => ({
            label: b,
            value: b,
          })),
          icon: <Layers3Icon className="mr-2 h-5 w-5" />,
        },
        {
          columnToFilter: "totalStock",
          title: "Depo",
          options: [
            ...new Set(
              ItemsData.data?.flatMap((i) =>
                i.ItemStock.flatMap((s) => s.storage),
              ),
            ),
          ].map((b) => ({
            label: b.name,
            value: b.id,
          })),
          icon: <WarehouseIcon className="mr-2 h-5 w-5" />,
        },
      ]}
      pagination
      serverSearch={{
        setState: setSearchInput,
        state: searchInput,
        title: "kod, barkod, isim",
      }}
      onRowClick={(row) => router.push(`items/${row.original?.id}}`)}
    />
  );
};

export default MainItemsList;
