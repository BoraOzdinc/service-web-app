"use client";
import { useDebounce } from "@uidotdev/usehooks";
import { useMemo, useState } from "react";
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
import { type getItems } from "../page";

export type ItemDataType = Awaited<ReturnType<typeof getItems>>;

export type SingleItemType = NonNullable<ItemDataType>[number];

const MainItemsList = ({ data }: { data: ItemDataType }) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearchInput = useDebounce(searchInput, 750);

  const modifiedItemsData = useMemo(() => {
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

  const router = useRouter();
  return (
    <DataTable
      data={modifiedItemsData}
      columns={columns}
      columnFilter={[
        {
          columnToFilter: "itemBrandId",
          title: "Marka",
          options: [
            ...new Set(modifiedItemsData?.flatMap((i) => i.ItemBrand?.name)),
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
              modifiedItemsData?.flatMap((i) => i.ItemColor?.colorCode),
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
            ...new Set(modifiedItemsData?.flatMap((i) => i.ItemSize?.sizeCode)),
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
            ...new Set(modifiedItemsData?.flatMap((i) => i.ItemCategory?.name)),
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
            ...new Set(
              modifiedItemsData?.flatMap((i) =>
                i.ItemStock.flatMap((s) => {
                  if ("Storage" in s) {
                    return s.Storage;
                  }
                }),
              ),
            ),
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
