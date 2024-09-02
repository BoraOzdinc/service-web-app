"use client";
import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";
import { DataTable } from "~/app/_components/tables/generic-table";
import { columns } from "./columns";
import {
  Layers3Icon,
  PaletteIcon,
  RulerIcon,
  TagsIcon,
  WarehouseIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/server";
import { type RouterOutputs } from "~/trpc/shared";
import { type SessionType } from "~/utils/getSession";

export type ItemDataType = RouterOutputs["items"]["getItems"];

export type SingleItemType = NonNullable<ItemDataType>[number];

const MainItemsList = ({ session }: { session: SessionType }) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearchInput = useDebounce(searchInput, 750);
  const { data: itemsData, isLoading } = api.items.getItems.useQuery({
    orgId: session?.orgId ?? undefined,
    searchInput: debouncedSearchInput,
  });

  const router = useRouter();
  return (
    <DataTable
      data={itemsData ?? []}
      columns={columns}
      isLoading={isLoading}
      columnFilter={[
        {
          columnToFilter: "itemBrandId",
          title: "Marka",
          options: [
            ...new Set(itemsData?.flatMap((i) => i.ItemBrand?.name)),
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
            ...new Set(itemsData?.flatMap((i) => i.ItemColor?.colorCode)),
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
            ...new Set(itemsData?.flatMap((i) => i.ItemSize?.sizeCode)),
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
            ...new Set(itemsData?.flatMap((i) => i.ItemCategory?.name)),
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
              itemsData
                ?.flatMap((item) =>
                  item.ItemStock.flatMap((stock) => stock.Storage).filter(
                    Boolean,
                  ),
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
