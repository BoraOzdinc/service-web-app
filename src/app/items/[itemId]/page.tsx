"use client";
import { useParams } from "next/navigation";
import Loader from "~/app/_components/loader";
import { api } from "~/trpc/server";

const ItemDetail = () => {
  const params = useParams<{ itemId: string }>();
  const itemId = params.itemId.replace(/%.*$/, "");
  const getItemWithId = api.items.getItemWithId.useQuery(itemId);

  if (getItemWithId.isLoading) {
    return <Loader />;
  }
  return <div>item Name: {getItemWithId.data?.name}</div>;
};

export default ItemDetail;
