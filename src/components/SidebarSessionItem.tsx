'use client'

import React, { JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


interface props {
  // ya quiete el path de las mendigas props porque este componente siempre apuntará a la misma URL para el perfil
  icon: JSX.Element,
  name: string
}

export const SidebarSessionItem = ({ icon, name }: props) => {
  // La ruta fija para el perfil del usuario actual
  const profileHref = "/dashboard/users"; // A ver si con esta jalada se corrige el hidration error

  const actualPath = usePathname(); // Obtiene la ruta actual del navegador

  return (
    <ul className="space-y-2 font-medium">
      <li>
        <Link
          href={profileHref}
          className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white group sidebar-menu-item-link ${actualPath === profileHref ? "sidebar-active-link" : ""}`}
          style={actualPath === profileHref ? { backgroundColor: 'var(--sidebar-box)' } : {}}
        >
          <div className="w-5 h-5 transition duration-75 menu-icon">
            {icon}
          </div>
          <span className="ms-3" style={{ color: 'var(--sidebar-text)' }}>{name}</span>
        </Link>
      </li>
    </ul>
  )
}
