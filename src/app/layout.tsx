import "~/styles/globals.css";

import { Poppins } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/app/_components/ui/navigation-menu";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Providers from "./providers";
import React from "react";
import { cn } from "~/lib/utils";

const inter = Poppins({
  weight: "400",
  display: "auto",
  preload: false,
  subsets: ["latin"],
});

export const metadata = {
  title: "Service Track App",
  description: "Service Track",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <html lang="en">
      <body className={`font-sans ${inter.className}`}>
        <TRPCReactProvider>
          <div className="p-3">
            <NavigationMenu>
              <NavigationMenuList>
                {session && (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Service App</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              href="/"
                            >
                              <div className="mb-2 mt-4 text-lg font-medium">
                                Anasayfa
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Anasayfa
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <ListItem href="/service" title="Servis">
                          Servis Takip ve İşlemler.
                        </ListItem>
                        <ListItem href="/customers" title="Müşteriler">
                          Müşteri Listesi
                        </ListItem>
                        <ListItem href="/items" title="Ürünler">
                          Ürün Listesi
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
            <div className="flex p-3">{children}</div>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
