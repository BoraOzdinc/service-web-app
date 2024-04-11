import {type ColumnDef } from "@tanstack/react-table";
import {type getCustomerType } from "~/utils/useCustomers";

export const columns: ColumnDef<getCustomerType>[] = [{ accessorKey: "name" }];
