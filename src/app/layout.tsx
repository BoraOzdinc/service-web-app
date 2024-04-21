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
import { auth } from "~/server/auth";
import Link from "next/link";
import React from "react";
import { cn } from "~/lib/utils";
import { Toaster } from "react-hot-toast";
import NextAuthProvider from "./context/NextAuthProvider";
import NavbarRoutes from "./config/navbarRoutes";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const inter = Poppins({
  weight: "400",
  display: "auto",
  preload: false,
  subsets: ["latin"],
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const metadata = {
  title: "Service Track App",
  description: "Service Track",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log(session);

  const isAnyOrg = session?.user.orgId ?? session?.user.dealerId;
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`font-sans ${inter.className}`}>
        <NextAuthProvider session={session}>
          <Toaster />
          <TRPCReactProvider>
            <div className="p-3">
              {isAnyOrg && session && (
                <NavigationMenu className="flex gap-3">
                  <NavigationMenuList>
                    {NavbarRoutes(session).map((parent) => {
                      return (
                        <NavigationMenuItem key={parent.title}>
                          <NavigationMenuTrigger>
                            {parent.title}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                              {parent.children.map((children) => {
                                if (children.isVisible) {
                                  return (
                                    <ListItem
                                      key={children.title}
                                      title={children.title}
                                      href={children.route}
                                    >
                                      {children.description}
                                    </ListItem>
                                  );
                                }
                              })}
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      );
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
              {isAnyOrg ? (
                <div className="flex items-center justify-center p-3">
                  {children}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3">
                  <Link
                    href={
                      session ? "/api/auth/signout" : "/api/auth/signin/google"
                    }
                    className="rounded-full bg-black px-10 py-3 font-semibold text-white no-underline transition"
                  >
                    {session ? "Sign out" : "Sign in"}
                  </Link>
                </div>
              )}
            </div>
          </TRPCReactProvider>
        </NextAuthProvider>
        <Analytics />
        <SpeedInsights />
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
