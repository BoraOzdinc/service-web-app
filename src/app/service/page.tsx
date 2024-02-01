import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../_components/tables/generic-table";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { fetchCustomerList } from "~/utils/fetchReqs";

const Service = async () => {
  return (
    <Card className="h-screen w-screen">
      <CardHeader>
        <CardTitle>Servis İşlemleri</CardTitle>
        <CardDescription>Servis işlemleri paneli</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default Service;
