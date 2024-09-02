import { type ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, EllipsisVertical, XCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "~/app/_components/ui/button";
import { Checkbox } from "~/app/_components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
  FormDescription,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import { useDeleteBarcode, useUpdateBarcode } from "~/utils/useItems";

interface FormType {
  barcode: string;
  unit: string;
  isMaster: boolean;
  quantity: number;
}

const ActionColumn = ({
  barcode,
}: {
  barcode: {
    id: string;
    barcode: string;
    unit: string;
    isMaster: boolean;
    quantity: number;
    itemId: string;
  };
}) => {
  const updateBarcode = useUpdateBarcode();
  const deleteBarcode = useDeleteBarcode();
  const form = useForm<FormType>({ defaultValues: { ...barcode } });
  const onSubmitForm = (data: FormType) => {
    updateBarcode.mutate({
      barcode: data.barcode,
      barcodeId: barcode.id,
      isMaster: data.isMaster,
      quantity: String(data.quantity),
      unit: data.unit,
    });
    form.reset();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"}>
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              disabled={barcode.isMaster}
            >
              Ana Barkod Yap
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Emin misin?</DialogTitle>
              <DialogDescription>
                Bu barkod ana barkod olarak ayarlanacak ve listelerde bu barkod
                görünecek!
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"}>Vazgeç</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={() =>
                    updateBarcode.mutate({
                      barcode: barcode.barcode,
                      barcodeId: barcode.id,
                      isMaster: true,
                      quantity: String(barcode.quantity),
                      unit: barcode.unit,
                    })
                  }
                >
                  Onayla
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog
          onOpenChange={(open) => {
            if (open) {
              form.reset();
            }
          }}
        >
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Düzenle
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Barkod Düzenle</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitForm)}
                className="flex flex-col gap-3"
              >
                <div className="flex flex-col gap-3">
                  <FormField
                    name="barcode"
                    rules={{ required: true }}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barkod</FormLabel>
                        <FormControl>
                          <Input placeholder="Barkod..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="unit"
                    rules={{ required: true }}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birim</FormLabel>
                        <FormControl>
                          <Input placeholder="Birim..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="quantity"
                    rules={{ required: true }}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bir Birimdeki Adet</FormLabel>
                        <FormControl>
                          <Input placeholder="Adet..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isMaster"
                    render={({ field }) => (
                      <FormItem className="flex flex-row  items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Ana Barkod</FormLabel>
                          <FormDescription>
                            Ana Barkod olarak seçtiğinizde ürün listesinde bu
                            barkod görünür.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant={"outline"}
                      type="button"
                      onClick={() => form.reset()}
                    >
                      Vazgeç
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button type="submit">Onayla</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-red-500"
            >
              Barkodu Sil
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Emin misin?</DialogTitle>
              <DialogDescription>
                Bu barkod ve bu barkod&apos;u içeren bütün stoklar silinecektir.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"}>Vazgeç</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={() =>
                    deleteBarcode.mutate({
                      barcodeId: barcode.id,
                    })
                  }
                >
                  Onayla
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<{
  id: string;
  barcode: string;
  unit: string;
  isMaster: boolean;
  quantity: number;
  itemId: string;
}>[] = [
  {
    id: "action",
    cell: ({ row: { original } }) => <ActionColumn barcode={original} />,
  },
  { accessorKey: "barcode", header: "Barkod" },
  { accessorKey: "unit", header: "Birim" },
  {
    accessorKey: "quantity",
    header: "Adet",
  },
  {
    accessorKey: "isMaster",
    header: "Ana Barkod",
    cell: ({
      row: {
        original: { isMaster },
      },
    }) => {
      if (!isMaster) {
        return <XCircleIcon />;
      }
      return <CheckCircle2Icon />;
    },
  },
];
