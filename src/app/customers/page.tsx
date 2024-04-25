import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { Button } from "../_components/ui/button";
import { PERMS } from "~/_constants/perms";
import { redirect } from "next/navigation";
import { getSession } from "~/utils/getSession";
import CustomerList from "./components/CustomersListComp";

const Customers = async () => {
  const session = await getSession();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Müşteri Listesi</CardTitle>
          <CardDescription>
            Müşteri Detayı için istediğiniz müşteriye tıklayın
          </CardDescription>
        </div>

        {session.permissions.includes(PERMS.manage_customers) ? (
          <Button onClick={() => redirect("/customers/new")}>
            Yeni Müşteri
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        <CustomerList />
      </CardContent>
    </Card>
  );
};

export default Customers;
