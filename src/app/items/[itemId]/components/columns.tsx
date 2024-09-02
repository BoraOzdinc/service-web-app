import { DialogTitle } from "@radix-ui/react-dialog";
import { Column, type ColumnDef } from "@tanstack/react-table";
import { FileSlidersIcon } from "lucide-react";
import { historyActions, itemHistoryFields } from "~/_constants";
import { DataTable } from "~/app/_components/tables/generic-table";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/app/_components/ui/popover";
import { type ItemHistory } from "~/utils/useItems";

export const columns: ColumnDef<ItemHistory>[] = [
  {
    accessorKey: "createDate",
    header: "Tarih",
    cell({
      row: {
        original: { createDate },
      },
    }) {
      const dateTime = new Date(createDate);
      return dateTime.toLocaleString();
    },
  },
  {
    accessorKey: "action",
    header: "İşlem",
    cell: ({
      row: {
        original: { action },
      },
    }) => {
      return historyActions[action];
    },
  },
  { accessorKey: "quantity", header: "Adet" },
  {
    accessorKey: "updatedBy",
    header: "İşlemi Yapan",
  },
  {
    accessorKey: "description",
    header: "Açıklama",
  },
  {
    accessorKey: "HistoryFieldUpdateDetails",
    header: "Değişiklikler",
    cell({
      row: {
        original: { HistoryFieldUpdateDetails },
      },
    }) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"outline"}>
              <FileSlidersIcon className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="flex w-full min-w-min flex-col overflow-x-auto">
            <DialogHeader>
              <DialogTitle>Değişiklikler</DialogTitle>
            </DialogHeader>
            <DataTable
              data={HistoryFieldUpdateDetails}
              columns={HistoryFieldUpdateDetailsColumns}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];

const HistoryFieldUpdateDetailsColumns: ColumnDef<
  ItemHistory["HistoryFieldUpdateDetails"][number]
>[] = [
  {
    accessorKey: "changedField",
    header: "Değişen Alan",
    cell({
      row: {
        original: { changedField },
      },
    }) {
      return (
        itemHistoryFields[changedField as keyof typeof itemHistoryFields] ||
        changedField
      );
    },
  },

  { accessorKey: "from", header: "Değişen Değer" },
  { accessorKey: "to", header: "Değiştirilen Değer" },
];
