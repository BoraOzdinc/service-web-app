import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";

const Customers = async () => {
  return (
    <Card className="flex  w-screen flex-col">
      <CardHeader>
        <CardTitle>Müşteri Listesi</CardTitle>
      </CardHeader>
      <CardContent className=" w-full">
        {/* customerList && <CustomerTable customerList={customerList} /> */}
      </CardContent>
    </Card>
  );
};

export default Customers;
