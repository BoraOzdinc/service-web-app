import {
  fetchCustomerList,
  fetchItems,
  fetchCustomerGroups,
} from "~/utils/fetchReqs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { DataTable } from "../_components/tables/generic-table";
import { columns } from "./components/columns";
import { Query, useQuery, useQueryClient } from "@tanstack/react-query";
import { extractData } from "~/utils";

const Customers = async () => {
  const customerList = await fetchCustomerList();
  const customerGroupsRes = await fetchCustomerGroups();

  return (
    <Card className="flex  w-screen flex-col">
      <CardHeader>
        <CardTitle>Müşteri Listesi</CardTitle>
      </CardHeader>
      <CardContent className=" w-full">
        {customerList && (
          <DataTable
            data={customerList.Entities}
            columns={columns}
            pagination
            inputFilter={{
              columnToFilter: "MusteriUnvani",
              title: "Müşteri İsmi",
            }}
            columnFilter={[
              {
                columnToFilter: "GrupAdi",
                options: customerGroupsRes.map((g) => {
                  return { label: g.GrupAdi, value: String(g.GrupId) };
                }),
                title: "Grup",
              },
            ]}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Customers;
