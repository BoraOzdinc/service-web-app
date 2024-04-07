import { type Session } from "next-auth";
import { PERMS } from "~/_constants/perms";

const NavbarRoutes: (session: Session) => {
  title: string;
  isVisible?: boolean;
  children: {
    title: string;
    route: string;
    description: string;
    isVisible: boolean;
  }[];
}[] = (session: Session) => {
  return [
    {
      title: "Ana Sayfa",
      children: [
        {
          title: "Anasayfa",
          route: "/",
          description: "Uygulama Anasayfası",
          isVisible: true,
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
          isVisible: Boolean(
            session.user.permissions.includes(PERMS.item_view),
          ),
        },
        {
          title: "Ürün Kabul",
          route: "/items/item-accept",
          description: "Ürün Kabul işlemleri.",
          isVisible: Boolean(
            session.user.permissions.includes(PERMS.item_view),
          ),
        },
        {
          title: "Ürün ayarları",
          route: "/items/settings",
          description:
            "Ürünlerinizin marka, renk, beden gibi değişkenlerini ayarlayın.",
          isVisible: Boolean(
            session.user.permissions.includes(PERMS.item_setting_view),
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
            session.user.orgId &&
              session.user.permissions.includes(PERMS.dealers_view),
          ),
        },
        {
          title: "Organizasyon Ayarları",
          route: `/settings/${session.user.orgId}`,
          description: "Organizasyon Üyelerini ve Rolleri Yönetin",
          isVisible: Boolean(
            session.user.orgId &&
              session.user.permissions.includes(
                PERMS.view_org_members || PERMS.view_org_role,
              ),
          ),
        },
        {
          title: "Bayii Ayarları",
          route: `/settings/dealers/${session.user.dealerId}`,
          description: "Bayii Yönetimi",
          isVisible: Boolean(
            session.user.dealerId &&
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              (session?.user.permissions.includes(PERMS.view_dealer_members) ||
                session?.user.permissions.includes(PERMS.view_dealer_role)),
          ),
        },
      ],
    },
  ];
};

export default NavbarRoutes;
