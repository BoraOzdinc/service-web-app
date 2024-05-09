"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import Loader from "~/app/_components/loader";
import { DataTable } from "~/app/_components/tables/generic-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { api } from "~/trpc/server";
import { RouterOutputs } from "~/trpc/shared";

type itemsDataType =
  RouterOutputs["storage"]["getBoxDetailsWithId"]["items"][number];

const BoxDetail = () => {
  const { boxId, shelfId } = useParams<{ shelfId: string; boxId: string }>();
  const { data: boxDetails, isLoading } =
    api.storage.getBoxDetailsWithId.useQuery({ boxId });

  if (isLoading) {
    return <Loader />;
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{boxDetails?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable data={boxDetails?.items} columns={columns} />
      </CardContent>
    </Card>
  );
};

const columns: ColumnDef<itemsDataType>[] = [
  {
    accessorKey: "item",
    header: "Ürün",
    cell({
      row: {
        original: {
          item: { name },
        },
      },
    }) {
      return name;
    },
  },
  { accessorKey: "quantity", header: "Adet" },
];

export default BoxDetail;
