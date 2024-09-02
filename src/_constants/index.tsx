export const PriceTypes = [
  { label: "Ana Bayii Fiyatı", value: "mainDealerPrice" },
  { label: "Bayii Fiyatı", value: "dealerPrice" },
  { label: "Toptan Fiyatı", value: "multiPrice" },
  { label: "Parakende Fiyatı", value: "singlePrice" },
];

export const AddressTypes = {
  Normal: "Adres",
  Billing: "Fatura",
  Shipping: "Kargo",
};

export const historyActions = {
  create: "Oluşturma",
  update: "Güncelleme",
  delete: "Silme",
};

export const itemHistoryFields = {
  name: "Ürün İsmi",
  itemCode: "Ürün Kodu",
  dealerPrice: "Bayii Fiyatı",
  mainDealerPrice: "Ana Bayii Fiyatı",
  multiPrice: "Toptan Fiyatı",
  singlePrice: "Parakende Fiyatı",
  isSerialNoRequired: "Seri No. Zorunlu",
  isServiceItem: "Servis Ürünü",
  netWeight: "Net Ağırlık (KG)",
  volume: "Ürün Hacmi (CDM)",
};
