"use client";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
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
import { useAddStorage, useDeleteStorage } from "~/utils/useItems";
import { api } from "~/trpc/server";

const StorageDialog = () => {
  const addStorage = useAddStorage();
  const deleteStorage = useDeleteStorage();
  const { data: storages, isLoading } = api.items.getStorages.useQuery({});
  const [storageInput, setStorageInput] = useState<string>();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button isLoading={isLoading} disabled={isLoading}>
          Depolar
        </Button>
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
            {storages.length > 0 ? (
              <CardContent>
                <ul className="flex list-disc flex-col gap-3 pl-3">
                  {storages.map((s) => {
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
      </DialogContent>
    </Dialog>
  );
};

export default StorageDialog;
