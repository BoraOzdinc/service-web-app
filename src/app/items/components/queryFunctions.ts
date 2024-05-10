import { getSession } from "~/utils/getSession";
import { createClient } from "~/utils/supabase/client";

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
