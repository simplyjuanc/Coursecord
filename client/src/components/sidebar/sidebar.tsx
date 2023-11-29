"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { RiDashboardFill } from "react-icons/ri";
import { IconType } from "react-icons";
import IconButton from "../buttons/iconButton";
import { RiLogoutBoxLine } from "react-icons/ri";
import { IoCaretBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { NavItem } from "@/types";
import { signOut } from "next-auth/react";
import { MdTextSnippet } from "react-icons/md";
import { IoIosHelpBuoy } from "react-icons/io";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const NavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "dashboard",
      icon: <RiDashboardFill />,
    },
    {
      title: "Syllabus",
      href: "syllabus",
      icon: <MdTextSnippet />,
    },
    {
      title: "Help",
      href: "help",
      icon: <IoIosHelpBuoy />,
    },
  ];

  const NavItemComponent = (props: { item: NavItem }) => {
    const isActive = pathname.includes(props.item.href);
    //probably change this to a regex just in case one of the object ids says dashboard or smn
    return (
      <div className="flex">
        {isActive && (
          <div
            className={`w-1.5 rounded-tr-2xl rounded-br-2xl bg-primary-red bg-opacity-50`}
          ></div>
        )}
        <Link href={props.item.href} className="w-full pr-4 pl-4">
          <button
            className={
              `flex text-3xl p-2 min-w-full rounded-xl` +
              (isActive
                ? " bg-primary-red bg-opacity-10 text-primary-red"
                : " hover:bg-primary-red hover:bg-opacity-5")
            }
          >
            <div className="my-auto">{props.item.icon}</div>
            <h2 className="font-semibold pl-3">{props.item.title}</h2>
          </button>
        </Link>
      </div>
    );
  };
  return (
    <div className="h-screen min-h-full min-w-max w-[12vw] bg-white shadow-lg relative box-border">
      <div className="flex p-4">
        <div className="w-10 h-10 rounded-full bg-primary-red bg-opacity-50 mr-4"></div>
        <h1 className="my-auto text-3xl text-primary-gray font-semibold">
          Coursecord
        </h1>
      </div>
      <div className="py-12">
        <ul>
          {NavItems.map((item, index) => (
            <li key={index} className="pt-4">
              <NavItemComponent item={item} />
            </li>
          ))}
        </ul>
      </div>
      <div onClick={() => {}} className="absolute bottom-0 mx-auto w-full p-3">
        <div className="pb-3">
          <IconButton
            title="Courses"
            icon={<IoCaretBackOutline />}
            onClick={() => {}}
          />
        </div>
        <IconButton
          title="Logout "
          icon={<RiLogoutBoxLine />}
          onClick={() => {
            signOut();
            router.push("/");
          }}
        />
      </div>
    </div>
  );
}
