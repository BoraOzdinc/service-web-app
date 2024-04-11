"use client";
import { api } from "~/trpc/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { DataTable } from "../_components/tables/generic-table";
import { columns } from "./components/columns";
import { Button } from "../_components/ui/button";
import { useSession } from "next-auth/react";
import { PERMS } from "~/_constants/perms";
import { useRouter } from "next/navigation";

const Customers = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const customers = api.customer.getCustomers.useQuery();
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Müşteri Listesi</CardTitle>
        {session?.user.permissions.includes(PERMS.manage_customers) ? (
          <Button onClick={() => router.push("/customers/new")}>
            Yeni Müşteri
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        <DataTable
          data={customers.data}
          isLoading={customers.isLoading}
          columns={columns}
          inputFilter={{ columnToFilter: "name", title: "İsim" }}
          onRowClick={({ original: { id } }) => router.push(`/customers/${id}`)}
          pagination
        />
      </CardContent>
    </Card>
  );
};

export default Customers;
