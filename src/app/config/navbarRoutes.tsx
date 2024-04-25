import { PERMS } from "~/_constants/perms";
import { db } from "~/server/db";

const NavbarRoutes: (userEmail: string) => Promise<
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
> = async (userEmail: string) => {
  const userMember = await db.member.findUnique({
    where: { userEmail },
    include: { roles: { include: { permissions: true } } },
  });
  const userPermission = [
    ...new Set(
      userMember?.roles.flatMap((r) => r.permissions.map((p) => p.name)),
    ),
  ];
  if (!userMember?.orgId && !userMember?.dealerId) {
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
          isVisible: Boolean(userPermission.includes(PERMS.customers_view)),
        },
      ],
    },
    {
      title: "Ürünler",
      children: [
        {
          title: "Tüm Ürünler",
          route: "/items",
          description: "Bütün ürünlerinizi görüntüleyin ve yönetin",
          isVisible: Boolean(userPermission.includes(PERMS.item_view)),
        },
        {
          title: "Ürün Kabul",
          route: "/items/item-accept",
          description: "Ürün Kabul işlemleri.",
          isVisible: Boolean(
            userPermission.includes(PERMS.item_accept_history_view),
          ),
        },
        {
          title: "Ürün Sevk/Satış",
          route: "/items/item-sell",
          description: "Ürün Sevk Edin veya Satın.",
          isVisible: Boolean(
            userPermission.includes(PERMS.item_sell_history_view),
          ),
        },
        {
          title: "Ürün ayarları",
          route: "/items/settings",
          description:
            "Ürünlerinizin marka, renk, beden gibi değişkenlerini ayarlayın.",
          isVisible: Boolean(userPermission.includes(PERMS.item_setting_view)),
        },
        {
          title: "Ürün Sayımı",
          route: "/items/counter",
          description:
            "Deponuzdaki ürünlerin sayımını yapın. eksik veya fazla ürünleri tespit edin.",
          isVisible: Boolean(
            userPermission.includes(PERMS.item_view) &&
              userPermission.includes(PERMS.manage_storage),
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
            userMember?.orgId && userPermission.includes(PERMS.dealers_view),
          ),
        },
        {
          title: "Organizasyon Ayarları",
          route: `/settings/${userMember?.orgId}`,
          description: "Organizasyon Üyelerini ve Rolleri Yönetin",
          isVisible: Boolean(
            userMember?.orgId &&
              userPermission.includes(
                PERMS.view_org_members || PERMS.view_org_role,
              ),
          ),
        },
        {
          title: "Bayii Ayarları",
          route: `/settings/dealers/${userMember?.dealerId}`,
          description: "Bayii Yönetimi",
          isVisible: Boolean(
            userMember?.dealerId &&
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              (userPermission.includes(PERMS.view_dealer_members) ||
                userPermission.includes(PERMS.view_dealer_role)),
          ),
        },
      ],
    },
  ];
};

export default NavbarRoutes;
