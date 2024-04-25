"use client";
import Loader from "~/app/_components/loader";
import { api } from "~/trpc/server";
import DealerCard from "./components/DealerCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { PERMS } from "~/_constants/perms";
import { Input } from "~/app/_components/ui/input";
import { useState } from "react";
import { Label } from "~/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import { useCreateDealer } from "~/utils/useDealer";
import { PriceTypes } from "~/_constants";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "~/utils/getSession";

const Dealers = () => {
  const { data: session } = useQuery({ queryFn: getSession });
  const { data: dealers, isLoading: dealersLoading } =
    api.dealer.getDealers.useQuery(undefined, { retry: false });
  const createDealer = useCreateDealer();
  const [newDealerName, setNewDealerName] = useState<string>("");
  const [newDealerType, setNewDealerType] = useState<string>("");

  if (dealersLoading || !dealers) {
    return <Loader />;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Bayiileriniz</CardTitle>
          <CardDescription>Yönetmek istediğiniz bayii seçin</CardDescription>
        </div>
        {session?.permissions.includes(PERMS.create_dealer) ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Yeni Bayii Oluştur</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Yeni Bayii</DialogHeader>
              <div>
                <Label>Bayii İsmi</Label>
                <Input
                  value={newDealerName}
                  onChange={(e) => setNewDealerName(e.target.value)}
                  placeholder="Bayii ismi"
                />
              </div>
              <Select onValueChange={setNewDealerType}>
                <SelectTrigger>
                  <SelectValue placeholder="Fiyat Tipi" />
                </SelectTrigger>
                <SelectContent>
                  {PriceTypes.map((p) => (
                    <SelectItem value={p.value} key={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={"outline"}>İptal</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    onClick={() =>
                      createDealer.mutate({
                        name: newDealerName,
                        price_type: newDealerType,
                      })
                    }
                    disabled={!newDealerName || !newDealerType}
                  >
                    Kaydet
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}
      </CardHeader>
      <CardContent className="grid w-full grid-cols-1 gap-3 md:grid-cols-3">
        {dealers.map((d) => {
          return <DealerCard key={d.id} dealerData={d} />;
        })}
      </CardContent>
    </Card>
  );
};

export default Dealers;
