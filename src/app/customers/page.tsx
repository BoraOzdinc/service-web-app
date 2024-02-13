import { fetchCustomerList } from "~/utils/fetchReqs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import CustomerTable from "./components/tableComp";

const Customers = async () => {
  const customerList = await fetchCustomerList();

  return (
    <Card className="flex  w-screen flex-col">
      <CardHeader>
        <CardTitle>Müşteri Listesi</CardTitle>
      </CardHeader>
      <CardContent className=" w-full">
        {customerList && <CustomerTable customerList={customerList} />}
      </CardContent>
    </Card>
  );
};

export default Customers;
