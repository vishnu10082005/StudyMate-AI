"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../../components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function SidebarDemo() {
  const links = [
    { label: "Dashboard", href: "#", icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Profile", href: "#", icon: <IconUserBolt className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Settings", href: "#", icon: <IconSettings className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Logout", href: "#", icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-white" /> },
  ];
  const [open, setOpen] = useState(true);
  return (
    <div className="flex h-screen w-screen bg-[#1E1C26]">
      <Sidebar open={open} setOpen={setOpen} className="h-screen bg-[#1E1C26]  text-white">
        <SidebarBody className="text-white justify-between gap-10 bg-[#1E1C26]">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} className="text-white" />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Image
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
              className="text-white"
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}
export const Logo = () => (
  <Link href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white" />
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium whitespace-pre text-white">
      Acet Labs
    </motion.span>
  </Link>
);
export const LogoIcon = () => (
  <Link href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white" />
  </Link>
);
const Dashboard = () => (
  <div className="flex flex-1 p-4">
    <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-700 bg-[#1E1C26] p-2 md:p-10">
      <div className="flex gap-2">
        {[...new Array(4)].map((_, idx) => (
          <div key={idx} className="h-20 w-full animate-pulse rounded-lg bg-gray-700"></div>
        ))}
      </div>
      <div className="flex flex-1 gap-2">
        {[...new Array(2)].map((_, idx) => (
          <div key={idx} className="h-full w-full animate-pulse rounded-lg bg-gray-700"></div>
        ))}
      </div>
    </div>
  </div>
);
