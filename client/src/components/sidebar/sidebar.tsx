"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { RiDashboardFill } from "react-icons/ri";

interface NavItem {
  title: string;
  href: string;
  icon: JSX.Element;
}

export default function Sidebar() {
  const NavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "dashboard",
      icon: <RiDashboardFill />,
    },
    {
      title: "Syllabus",
      href: "syllabus",
      icon: <RiDashboardFill />,
    },
    {
      title: "Help",
      href: "help",
      icon: <RiDashboardFill />,
    },
  ];
  const pathname = usePathname();
  const NavItemComponent = (props: { item: NavItem }) => {
    const isActive = pathname.split("/").slice(-1)[0] === props.item.href;
    return (
      <li key={props.item.title} className="pt-4">
        <Link href={props.item.href}>
          <button
            className={
              `flex text-3xl ` +
              (isActive ? "bg-primary-red bg-opacity-10 p-2" : "")
            }
          >
            <div className="my-auto">{props.item.icon}</div>
            <h1 className="font-semibold pl-3">{props.item.title}</h1>
          </button>
        </Link>
      </li>
    );
  };
  return (
    <div className="h-screen min-h-full min-w-max bg-white shadow-lg">
      <div className="flex p-4">
        <div className="w-10 h-10 rounded-full bg-red-500 mr-4"></div>
        <h1 className="my-auto text-3xl text-primary-gray font-semibold">
          Coursecord
        </h1>
      </div>
      <div className="px-4 py-12">
        <ul>
          {NavItems.map((item) => (
            <NavItemComponent item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}
