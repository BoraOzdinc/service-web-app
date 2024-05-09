"use client";
import { api } from "~/trpc/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../_components/ui/select";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Shelf from "./components/Shelf";

const Layout = () => {
  const [selectedStorageID, setSelectedStorageID] = useState<string>("");

  const storages = api.storage.getStorages.useQuery();
  const shelfData = api.storage.getStorageLayoutItems.useQuery(
    {
      storageId: selectedStorageID,
    },
    { enabled: selectedStorageID.length > 1 },
  );
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>Depo Düzeni</CardTitle>
        <div className="flex items-center gap-2">
          {storages.isLoading && <Loader2 className="h-6 w-6 animate-spin" />}
          <Select
            onValueChange={setSelectedStorageID}
            value={selectedStorageID}
            disabled={storages.isLoading}
          >
            <SelectTrigger className="max-w-[180px]">
              <SelectValue placeholder="Depo Seçin..." />
            </SelectTrigger>
            <SelectContent>
              {storages.data?.map((s) => (
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

export default Layout;
