"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useCreateOrg } from "~/utils/useOrg";
import { useRouter } from "next/navigation";

const CreateOrgDialog = () => {
  const [input, setInput] = useState<string>("");
  const createOrg = useCreateOrg();
  const router = useRouter();

  useEffect(() => {
    if (createOrg.isSuccess) {
      router.refresh();
    }
  }, [createOrg.isSuccess, router]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Organizasyon Oluştur</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Organizasyon Oluştur</DialogTitle>
          <DialogDescription>
            Organizasyon İsmi en az 3 karakter olmalı
          </DialogDescription>
        </DialogHeader>
        <Label>Organizasyon İsmi</Label>
        <Input
          value={input}
          onChange={(v) => {
            setInput(v.target.value);
          }}
          placeholder="isim..."
        />
        <DialogClose asChild>
          <Button
            isLoading={createOrg.isLoading}
            disabled={input?.length < 3}
            onClick={() => {
              createOrg.mutate(input);
            }}
          >
            Oluştur
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrgDialog;
