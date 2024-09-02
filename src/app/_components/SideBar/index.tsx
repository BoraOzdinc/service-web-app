"use client";
import React from "react";
import { Box, Menu, Power } from "lucide-react";
import { type navConfig } from "~/app/config/navbarRoutes";
import { type SessionType } from "~/utils/getSession";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { signOut } from "~/app/login/actions";

export function SidebarWithBurgerMenu({
  navbarRoutes,
  session,
}: {
  navbarRoutes: navConfig;
  session: SessionType;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"}>
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>
            <div className="mb-2 flex items-center gap-4 p-4">
              <Box />
              <h5 color="blue-gray">Inventory Ark</h5>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div>
          {navbarRoutes.map((route, index) => {
            if (
              route.children &&
              (session.permissions.includes(route.permissions) ||
                route.permissions === "")
            ) {
              return (
                <Accordion key={index} type="single">
                  <AccordionItem value={`${route.title + index}`}>
                    <AccordionTrigger>
                      <div className="flex flex-row items-center gap-3">
                        {route.icon as React.ReactNode}
                        <p className="text-lg font-semibold">{route.title}</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="w-full">
                      {route.children.map((child) => {
                        if (session.permissions.includes(child.permissions)) {
                          return (
                            <Link href={child.path ?? "#"} key={child.title}>
                              <SheetClose asChild>
                                <div className="flex flex-row items-center gap-3 rounded-md p-3 hover:bg-accent">
                                  {child.icon as React.ReactNode}
                                  <p className="text-lg font-semibold">
                                    {child.title}
                                  </p>
                                </div>
                              </SheetClose>
                            </Link>
                          );
                        }
                      })}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            }
            if (session.permissions.includes(route.permissions)) {
              return (
                <Link key={route.title} href={route.path ?? "#"}>
                  <SheetClose key={route.title} asChild>
                    <div className="flex w-full cursor-pointer flex-row items-center gap-3 rounded-md p-3 hover:bg-accent">
                      {route.icon as React.ReactNode}
                      <p className="text-lg font-semibold">{route.title}</p>
                    </div>
                  </SheetClose>
                </Link>
              );
            }
          })}
          {session.email ? (
            <SheetClose asChild>
              <div
                className="mt-3 flex w-full cursor-pointer flex-row items-center gap-3 rounded-md p-3 hover:bg-accent"
                onClick={() => signOut()}
              >
                <Power />
                <p className="text-lg font-semibold">Çıkış Yap</p>
              </div>
            </SheetClose>
          ) : (
            <Link href={"/login"}>
              <SheetClose asChild>
                <div className="mt-3 flex w-full cursor-pointer flex-row items-center gap-3 rounded-md p-3 hover:bg-accent">
                  <Power />
                  <p className="text-lg font-semibold">Giriş Yap</p>
                </div>
              </SheetClose>
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
