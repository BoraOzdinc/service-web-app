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
import { useQuery } from "@tanstack/react-query";
import { getSession } from "~/utils/getSession";
import { createClient } from "~/utils/supabase/client";

export type SingleItemType = NonNullable<
  Awaited<ReturnType<typeof getItems>>
>[number];

const MainItemsList = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearchInput = useDebounce(searchInput, 750);
  const { data, isLoading } = useQuery({
    queryKey: ["getItems"],
    queryFn: getItems,
  });
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
      isLoading={isLoading}
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
const getItems = async () => {
  const session = await getSession();
  const supabase = createClient();
  let itemData;
  if (session.orgId) {
    const { data } = await supabase
      .from("Item")
      .select(
        "*,ItemColor(*),ItemSize(*),ItemCategory(*),ItemBrand(*),ItemStock(*,Storage(*)),itemBarcode(*)",
      )
      .eq("orgId", session.orgId);

    if (data) {
      itemData = data;
    }
  }

  if (session.dealerId) {
    const { data } = await supabase
      .from("Item")
      .select(
        "*,ItemColor(*),ItemSize(*),ItemCategory(*),ItemBrand(*),ItemStock(*,Storage(*)),itemBarcode(*)",
      )
      .eq("dealerId", session.dealerId);

    if (data) {
      itemData = data;
    }
  }
  return itemData;
};
export default MainItemsList;
