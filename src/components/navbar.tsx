"use client";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import React from "react";
import { cn } from "@/lib/utils";
import { Disc3, Github } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <main className="p-4 z-20 xl:px-20 md:px-20 px-10">
      <div className="flex items-center justify-between gap-5">
        <div className="flex gap-2">
          <a href="/">
            <div className="flex gap-2 items-center bg-accent/50 px-3 py-2 rounded-xl hover:scale-105 transition-transform">
              <Disc3 />
              <h1 className="text-sm font-bold">releases-web</h1>
            </div>
          </a>
          {/* <div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <ListItem href="/" title="Musics">
                        Veja os novos lancamentos dos seus artistas preferidos.
                      </ListItem>
                      <ListItem href="/" title="Albums">
                        Veja os novos lancamentos dos seus artistas preferidos.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div> */}
        </div>
        <Link href="https://github.com/c4slu/releases-web" target="_blank">
          <div className="flex items-center p-2 bg-accent/50 rounded-xl hover:bg-accent transition-colors">
            <Github />
          </div>
        </Link>
      </div>
    </main>
  );
}
