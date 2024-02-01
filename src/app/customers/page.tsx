import { fetchCustomerList, fetchItems } from "~/utils/fetchReqs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { DataTable } from "../_components/tables/generic-table";
import { columns } from "./components/columns";

const Customers = async () => {
  const data = await fetchCustomerList();
  await fetchItems();
  return (
    <Card className="flex  w-screen flex-col">
      <CardHeader>
        <CardTitle>Müşteri Listesi</CardTitle>
      </CardHeader>
      <CardContent className="flex">
        <DataTable data={data.Entities} columns={columns} pagination />
      </CardContent>
    </Card>
  );
};

export default Customers;
