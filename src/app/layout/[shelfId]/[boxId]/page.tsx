"use client";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import Loader from "~/app/_components/loader";
import { DataTable } from "~/app/_components/tables/generic-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import {
  type BoxDetailsType,
  getBoxDetailsWithId,
} from "./components/queryFunctions";
import Link from "next/link";
import { CircleArrowLeftIcon } from "lucide-react";

const BoxDetail = () => {
  const { shelfId, boxId } = useParams<{ shelfId: string; boxId: string }>();
  const { data: boxDetails, isLoading } = useQuery({
    queryKey: ["getShelfBox", boxId],
    queryFn: async () => await getBoxDetailsWithId(boxId),
  });

  if (isLoading) {
    return <Loader />;
  }
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-1 space-y-0">
        <Link href={`/layout/${shelfId}`}>
          <CircleArrowLeftIcon />
        </Link>
        <CardTitle className="mt-0">{boxDetails?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable data={boxDetails?.ShelfItemDetail} columns={columns} />
      </CardContent>
    </Card>
  );
};

const columns: ColumnDef<
  NonNullable<BoxDetailsType>["ShelfItemDetail"][number]
>[] = [
  {
    accessorKey: "item",
    header: "Ürün",
    cell({
      row: {
        original: { Item },
      },
    }) {
      return Item?.name;
    },
  },
  { accessorKey: "quantity", header: "Adet" },
];

export default BoxDetail;
