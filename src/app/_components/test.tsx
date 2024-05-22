"use client";
import { api } from "~/trpc/server";
import { Button } from "./ui/button";

const Test = () => {
  const qr = api.storage.qrGenerate.useMutation();
  return (
    <>
      <img src={qr.data} />
      <Button
        onClick={() => {
          qr.mutate({
            text: "https://inventoryark.com/layout/clvtco6x500008k9qdgxsmk5m/clvverwuv0000s4jlvp46v6ew",
          });
        }}
      >
        QrLink Oluştur
      </Button>
    </>
  );
};

export default Test;
