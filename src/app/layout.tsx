import "~/styles/globals.css";

import { Poppins } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { NavigationMenuLink } from "~/app/_components/ui/navigation-menu";
import React from "react";
import { cn } from "~/lib/utils";
import { Toaster } from "react-hot-toast";
import NavbarRoutes from "./config/navbarRoutes";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { SidebarWithBurgerMenu } from "./_components/SideBar";
import { getSession } from "~/utils/getSession";
import { SessionProvider } from "~/utils/SessionProvider";

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
  const session = await getSession();
  console.log(session);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <SessionProvider session={session}>
        <body className={`font-sans ${inter.className}`}>
          <Toaster />
          <TRPCReactProvider>
            <div className="p-3">
              <div className="z-10">
                {session && (
                  <SidebarWithBurgerMenu
                    navbarRoutes={NavbarRoutes(session)}
                    session={session}
                  />
                )}
              </div>
              <div className="flex items-center justify-center p-3">
                {children}
              </div>
            </div>
          </TRPCReactProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </SessionProvider>
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
