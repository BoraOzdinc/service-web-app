"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import ColorComp from "./components/ColorComponent";
import SizeComp from "./components/SizeComponent";
import CategoryComp from "./components/CategoryComponent";
import BrandComp from "./components/BrandComponent";

const Settings = () => {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Ürün Ayarları</CardTitle>
      </CardHeader>
      <CardContent className=" grid grid-cols-1 gap-3 md:grid-cols-2">
        <ColorComp />
        <SizeComp />
        <CategoryComp />
        <BrandComp />
      </CardContent>
    </Card>
  );
};

export default Settings;
