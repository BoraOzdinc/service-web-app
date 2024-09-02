import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { Button } from "../_components/ui/button";
import Link from "next/link";
import StorageDialog from "./components/StorageDialog";
import MainItemsList from "./components/ItemsListComponent";
import { getSession } from "~/utils/getSession";
import { PERMS } from "~/_constants/perms";

const Items = async () => {
  const session = await getSession();
  return (
    <Card className="flex w-full flex-col overflow-x-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ürün Listesi</CardTitle>
        <div className=" flex gap-3">
          {session?.permissions.includes(PERMS.manage_storage) && (
            <StorageDialog />
          )}
          <Link href={"/items/new-item"}>
            <Button>Yeni ürün ekle</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className=" w-full">
        <MainItemsList session={session} />
      </CardContent>
    </Card>
  );
};

export default Items;
