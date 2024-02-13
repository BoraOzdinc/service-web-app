import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";

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
