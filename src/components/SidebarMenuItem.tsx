
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
        <Link
          href={path}
          className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white group sidebar-menu-item-link ${actualPath === path ? "sidebar-active-link" : ""}`}
          style={actualPath === path ? { backgroundColor: 'var(--sidebar-seleccion)' } : {}}
        >
          <div className="w-5 h-5 transition duration-75 menu-icon">
            {icon}
          </div>
          <span className="ms-3" style={{ color: 'var(--sidebar-text)' }}>{name}</span>
          <span className="inline-flex items-center justify-center px-2 ms-8 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
        </Link>
      </li>
    </ul>
  )
}

