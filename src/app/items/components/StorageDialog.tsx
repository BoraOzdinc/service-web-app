"use client";
import { useQuery } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { PERMS } from "~/_constants/perms";
import Loader from "~/app/_components/loader";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { getSession } from "~/utils/getSession";
import { createClient } from "~/utils/supabase/client";
import { useAddStorage, useDeleteStorage } from "~/utils/useItems";

const StorageDialog = () => {
  const { data: storages, isLoading } = useQuery({
    queryKey: ["getStorages"],
    queryFn: getStorages,
  });
  const addStorage = useAddStorage();
  const deleteStorage = useDeleteStorage();
  const [storageInput, setStorageInput] = useState<string>();
  if (isLoading || !storages?.storageData) {
    return <Loader />;
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Depolar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Depolar</DialogTitle>
        </DialogHeader>
        {storages && (
          <Card>
            <CardHeader>
              <CardTitle>Depolar</CardTitle>
            </CardHeader>
            {storages.storageData?.length > 0 ? (
              <CardContent>
                <ul className="flex list-disc flex-col gap-3 pl-3">
                  {storages.storageData?.map((s) => {
                    return (
                      <li key={s.id}>
                        <div className="flex items-center gap-3">
                          <p>{s.name}</p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant={"destructive"}>
                                <TrashIcon width={"15px"} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Emin Misin?</DialogTitle>
                                <DialogDescription>
                                  Eğer bu depoyu silersen bütün içerisindeki
                                  stoklar ile birlikte silinecektir!
                                </DialogDescription>
                              </DialogHeader>
                              <DialogClose asChild>
                                <Button variant={"outline"}>Vazgeç</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button
                                  onClick={() => deleteStorage.mutate(s.id)}
                                  variant={"destructive"}
                                >
                                  Sil
                                </Button>
                              </DialogClose>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            ) : (
              <CardContent>Depo Bulunamadı!</CardContent>
            )}
          </Card>
        )}
        {storages?.session.permissions.includes(PERMS.manage_storage) && (
          <>
            <div>
              <Label>Depo Adı</Label>
              <Input
                value={storageInput}
                onChange={(v) => setStorageInput(v.target.value)}
                placeholder="Depo Adı..."
              />
            </div>
            <Button
              onClick={() => {
                if (storageInput)
                  addStorage.mutate({
                    name: storageInput,
                  });
              }}
              disabled={!storageInput}
            >
              Ekle
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
const getStorages = async () => {
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
export default StorageDialog;
