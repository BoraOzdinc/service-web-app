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
      title: "Storage",
      permissions: PERMS.item_view,
      icon: <BoxesIcon />,
      children: [
        {
          title: "Products",
          path: "/items",
          permissions: PERMS.item_view,
        },
        {
          title: "Products Settings",
          path: "/items/settings",
          permissions: PERMS.item_setting_view,
        },
        {
          title: "Counter",
          path: "/items/counter",
          permissions: PERMS.manage_storage,
        },
        {
          title: "Product Accept",
          path: "/items/item-accept/new",
          permissions: PERMS.item_accept,
        },
        {
          title: "Product Sale",
          path: "/items/item-sell/new",
          permissions: PERMS.item_sell,
        },
      ],
    },
    {
      title: "Customer",
      permissions: PERMS.customers_view,
      icon: <UsersIcon />,
      children: [
        {
          title: "Customers",
          path: "/customers",
          permissions: PERMS.customers_view,
        },
      ],
    },
    {
      title: "Settings",
      permissions: "",
      icon: <CogIcon />,
      children: [
        {
          title: "Dealers",
          path: "/settings/dealers",
          permissions: PERMS.dealers_view,
        },
        {
          title: "My Organization",
          path: `/settings/${session.orgId}`,
          permissions: PERMS.view_org_members,
        },
      ],
    },
  ];
};

export default NavbarRoutes;
