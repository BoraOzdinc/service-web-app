import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { Button } from "../_components/ui/button";
import Link from "next/link";
import StorageDialog from "./components/StorageDialog";
import MainItemsList from "./components/ItemsListComponent";
import { getSession } from "~/utils/getSession";
import { createClient } from "~/utils/supabase/client";

const Items = async () => {
  const itemsData = await getItems(undefined, undefined);
  const storagesData = await getStorages();
  return (
    <Card className="flex w-full flex-col overflow-x-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ürün Listesi</CardTitle>
        <div className=" flex gap-3">
          <StorageDialog storages={storagesData} />
          <Link href={"/items/new-item"}>
            <Button>Yeni ürün ekle</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className=" w-full">
        <MainItemsList data={itemsData} />
      </CardContent>
    </Card>
  );
};

export const getItems = async (orgId?: string, dealerId?: string) => {
  const session = await getSession();
  const supabase = createClient();
  let itemData;
  if (!orgId && !dealerId) {
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
  }
  if (orgId) {
    const { data } = await supabase
      .from("Item")
      .select(
        "*,ItemColor(*),ItemSize(*),ItemCategory(*),ItemBrand(*),ItemStock(*,Storage(*)),itemBarcode(*)",
      )
      .eq("orgId", orgId);

    if (data) {
      itemData = data;
    }
  }

  if (dealerId) {
    const { data } = await supabase
      .from("Item")
      .select(
        "*,ItemColor(*),ItemSize(*),ItemCategory(*),ItemBrand(*),ItemStock(*,Storage(*)),itemBarcode(*)",
      )
      .eq("dealerId", dealerId);

    if (data) {
      itemData = data;
    }
  }
  return itemData;
};

export const getStorages = async () => {
  const supabase = createClient();
  const session = await getSession();
  let storageData;
  if (session.orgId) {
    const storages = await supabase
      .from("Storage")
      .select("*")
      .eq("orgId", session.orgId);
    storageData = storages.data;
  }
  if (session.dealerId) {
    const storages = await supabase
      .from("Storage")
      .select("*")
      .eq("dealerId", session.dealerId);
    storageData = storages.data;
  }
  return { storageData, session };
};
export default Items;
