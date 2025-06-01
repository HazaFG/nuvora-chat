import React, { JSX } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface props {
  path: string,
  icon: JSX.Element,
  name: string
}

export const SidebarMenuItem = ({ path, icon, name }: props) => {
  const actualPath = usePathname()
  return (
    <ul className="space-y-2 font-medium">
      <li>
        <Link href={path} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group         ${actualPath === path ? "bg-gray-700 rounded-xl" : ""}`}
        >
          <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
            {icon}
          </div>
          <span className="ms-3">{name}</span>
          <span className="inline-flex items-center justify-center px-2 ms-8 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
        </Link>
      </li>
    </ul>
  )
}


