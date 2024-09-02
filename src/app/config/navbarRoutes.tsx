import { BoxesIcon, CogIcon, UsersIcon, type LucideIcon } from "lucide-react";
import React from "react";
import { PERMS } from "~/_constants/perms";
import { type SessionType } from "~/utils/getSession";

export type navConfig = {
  title: string;
  icon?: LucideIcon | React.JSX.Element;
  path?: string;
  permissions: string;
  children?: navConfig;
}[];

const NavbarRoutes = (session: SessionType): navConfig => {
  return [
    {
      title: "Depo Yönetimi",
      permissions: PERMS.item_view,
      icon: <BoxesIcon />,
      children: [
        {
          title: "Ürün Listesi",
          path: "/items",
          permissions: PERMS.item_view,
        },
        {
          title: "Ürün Özellikleri",
          path: "/items/settings",
          permissions: PERMS.item_setting_view,
        },
        {
          title: "Ürün Sayımı",
          path: "/items/counter",
          permissions: PERMS.manage_items,
        },
        {
          title: "Ürün Kabul",
          path: "/items/item-accept/new",
          permissions: PERMS.item_accept,
        },
        {
          title: "Ürün Satış",
          path: "/items/item-sell/new",
          permissions: PERMS.item_sell,
        },
      ],
    },
    {
      title: "Müşteri Yönetimi",
      permissions: PERMS.customers_view,
      icon: <UsersIcon />,
      children: [
        {
          title: "Müşteri Listesi",
          path: "/customers",
          permissions: PERMS.customers_view,
        },
      ],
    },
    {
      title: "Ayarlar",
      permissions: "",
      icon: <CogIcon />,
      children: [
        {
          title: "Bayiiler",
          path: "/settings/dealers",
          permissions: PERMS.dealers_view,
        },
        {
          title: "Organizasyonum",
          path: `/settings/${session.orgId}`,
          permissions: PERMS.view_org_members,
        },
      ],
    },
  ];
};

export default NavbarRoutes;
