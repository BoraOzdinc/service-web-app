"use client";

import { api } from "~/trpc/server";
import { columns } from "./columns";
import { DataTable } from "~/app/_components/tables/generic-table";
import { useRouter } from "next/navigation";

const CustomerList = () => {
  const router = useRouter();

  const customers = api.customer.getCustomers.useQuery({});

  return (
    <DataTable
      data={customers.data}
      isLoading={customers.isLoading}
      columns={columns}
      inputFilter={{ columnToFilter: "name", title: "İsim" }}
      onRowClick={({ original: { id } }) => router.push(`/customers/${id}`)}
      pagination
    />
  );
};

export default CustomerList;
