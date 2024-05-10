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
import { getSession } from "~/utils/getSession";
import {
  getBrands,
  getCategories,
  getColors,
  getSizes,
} from "./components/queryFunctions";

const Settings = async () => {
  const session = await getSession();
  const colorsData = await getColors(session);
  const categoriesData = await getCategories(session);
  const sizesData = await getSizes(session);
  const brandsData = await getBrands(session);

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Ürün Ayarları</CardTitle>
      </CardHeader>
      <CardContent className=" grid grid-cols-1 gap-3 md:grid-cols-2">
        <ColorComp colors={colorsData} />
        <SizeComp sizes={sizesData} />
        <CategoryComp categories={categoriesData} />
        <BrandComp brands={brandsData} />
      </CardContent>
    </Card>
  );
};

export default Settings;
