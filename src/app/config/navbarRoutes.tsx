import { PERMS } from "~/_constants/perms";
import { getSession } from "~/utils/getSession";

const NavbarRoutes: () => Promise<
  {
    title: string;
    isVisible?: boolean;
    children: {
      title: string;
      route: string;
      description: string;
      isVisible: boolean;
    }[];
  }[]
> = async () => {
  const session = await getSession();
  console.log(session);

  if (session?.orgId && session?.dealerId) {
    return [];
  }
  return [
    {
      title: "Müşteriler",
      children: [
        {
          title: "Tüm Müşteriler",
          route: "/customers",
          description: "Bütün Müşterilerinizi Görüntüleyin ve Yönetin",
          isVisible: Boolean(
            session.permissions.includes(PERMS.customers_view),
          ),
        },
      ],
    },
    {
      title: "İşlemler",
      children: [
        {
          title: "Tüm Ürünler",
          route: "/items",
          description: "Bütün ürünlerinizi görüntüleyin ve yönetin",
          isVisible: Boolean(session.permissions.includes(PERMS.item_view)),
        },
        {
          title: "Ürün Kabul",
          route: "/items/item-accept",
          description: "Ürün Kabul işlemleri.",
          isVisible: Boolean(
            session.permissions.includes(PERMS.item_accept_history_view),
          ),
        },
        {
          title: "Ürün Sevk/Satış",
          route: "/items/item-sell",
          description: "Ürün Sevk Edin veya Satın.",
          isVisible: Boolean(
            session.permissions.includes(PERMS.item_sell_history_view),
          ),
        },

        {
          title: "Ürün Sayımı",
          route: "/items/counter",
          description:
            "Deponuzdaki ürünlerin sayımını yapın. eksik veya fazla ürünleri tespit edin.",
          isVisible: Boolean(
            session.permissions.includes(PERMS.item_view) &&
              session.permissions.includes(PERMS.manage_storage),
          ),
        },
        {
          title: "Depo Düzeni",
          route: "/layout",
          description: "Deponuzdaki ürünleri düzene sokun.",
          isVisible: Boolean(
            session.permissions.includes(PERMS.manage_storage),
          ),
        },
      ],
    },
    {
      title: "Ayarlar",
      children: [
        {
          title: "Bayiiler",
          route: "/settings/dealers",
          description: "Bütün Bayiileriniz",
          isVisible: Boolean(
            session?.orgId && session.permissions.includes(PERMS.dealers_view),
          ),
        },
        {
          title: "Ürün ayarları",
          route: "/items/settings",
          description:
            "Ürünlerinizin marka, renk, beden gibi değişkenlerini ayarlayın.",
          isVisible: Boolean(
            session.permissions.includes(PERMS.item_setting_view),
          ),
        },
        {
          title: "Organizasyon Ayarları",
          route: `/settings/${session?.orgId}`,
          description: "Organizasyon Üyelerini ve Rolleri Yönetin",
          isVisible: Boolean(
            session?.orgId &&
              session.permissions.includes(
                PERMS.view_org_members || PERMS.view_org_role,
              ),
          ),
        },
        {
          title: "Bayii Ayarları",
          route: `/settings/dealers/${session?.dealerId}`,
          description: "Bayii Yönetimi",
          isVisible: Boolean(
            session?.dealerId &&
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              (session.permissions.includes(PERMS.view_dealer_members) ||
                session.permissions.includes(PERMS.view_dealer_role)),
          ),
        },
      ],
    },
  ];
};

export default NavbarRoutes;
