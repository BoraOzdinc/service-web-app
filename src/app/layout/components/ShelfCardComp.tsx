"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import { getStorageLayoutItems, type getStoragesType } from "./queryFunctions";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { type SessionType } from "~/utils/getSession";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Shelf from "./Shelf";

const ShelfCard = ({
  storages,
  session,
}: {
  storages: getStoragesType;
  session: SessionType;
}) => {
  const [selectedStorageID, setSelectedStorageID] = useState("");

  const shelfData = useQuery({
    queryKey: ["shelfData", { session, selectedStorageID }],
    queryFn: async () => {
      return await getStorageLayoutItems(session, selectedStorageID);
    },
    enabled: selectedStorageID.length > 0,
  });

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>Depo Düzeni</CardTitle>
        <div className="flex items-center gap-2">
          <Select
            onValueChange={setSelectedStorageID}
            value={selectedStorageID}
            disabled={storages.isLoading}
          >
            <SelectTrigger className="max-w-[180px]">
              <SelectValue placeholder="Depo Seçin..." />
            </SelectTrigger>
            <SelectContent>
              {storages.storages?.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <CardTitle>Raflar</CardTitle>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {shelfData.isFetching ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            shelfData.data?.map((s) => {
              return <Shelf key={s.id} data={s} />;
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShelfCard;
