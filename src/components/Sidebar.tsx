'use client'
import { useState } from "react";
import Image from "next/image"
import { IoChatboxEllipsesOutline, IoPersonCircleOutline, IoAddCircleOutline, IoTrashOutline, IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarSessionItem } from "./SidebarSessionItem";
import { useTheme } from '../hooks/useTheme';

//Aqui vamos a traernos en forma de arreglo todo nuestos elementos de SideBarMenuItem
const menuItems = [
  {
    path: '/dashboard/main',
    icon: <IoChatboxEllipsesOutline size={22} />,
    name: 'Conversaciones'
  },
  {
    path: '/dashboard/nosequeponeraqui',
    icon: <IoAddCircleOutline size={22} />,
    name: 'Crear sala'
  },
  {
    path: '/dashboard/unirsesalg',
    icon: <IoAddCircleOutline size={22} />,
    name: 'Unirse sala'
  }

]

const sessionItems = [
  {
    path: '/dashboard/users',
    icon: <IoPersonCircleOutline size={22} />,
    name: 'Usuario'
  },
  {
    path: '/dashboard/cerrar',
    icon: <IoTrashOutline size={22} />,
    name: 'Cerrar Sesion'
  }
]

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="z-50 inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
          <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 w-64 h-screen transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        {/*Este es el container perro*/}
        <div
          className="h-full px-3 py-4 overflow-y-auto"
          style={{
            backgroundColor: 'var(--sidebar-background)',
            color: 'var(--sidebar-text)',
          }}
        >
          {/*Esta cosa es la parte donde esta todo el texto de flowbite*/}
          <div className="flex items-center ps-2.5 mb-5">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="mr-4 z-50 items-center text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>

            <Image src="/cloudWhite.png" width={40} height={20} className="me-3" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap font-madimi" style={{ color: 'var(--sidebar-text)' }}>Nuvora chat</span>
          </div>

          <div className="mt-8" style={{ color: 'var(--sidebar-text)' }}>
            <h1>Conversaciones</h1>
          </div>

          {/*Aqui es donde esta la lista de elementos iterables relacionados con las salas*/}
          <div className="mt-2">
            {
              menuItems.map(element => (
                <SidebarMenuItem
                  key={element.path}
                  path={element.path}
                  icon={element.icon}
                  name={element.name}
                />
              ))
            }
          </div>

          {/*cambio de tema pedorro */}
          <button
            onClick={toggleTheme}
            // Aplicamos las mismas clases que el Link, pero sin la lógica de "active"
            className="flex p-2 mt-1 text-gray-900 rounded-lg dark:text-white group sidebar-menu-item-link w-full"
            style={{ color: 'var(--sidebar-text)' }}
          >
            {theme === 'dark' ? (
              // Usa la clase 'menu-icon' para que herede los estilos de color de icono
              <IoSunnyOutline size={22} className="shrink-0 w-5 h-5 transition duration-75 menu-icon" />
            ) : (
              // Usa la clase 'menu-icon' para que herede los estilos de color de icono
              <IoMoonOutline size={22} className="shrink-0 w-5 h-5 transition duration-75 menu-icon" />
            )}
            <span className="ml-3 whitespace-nowrap">
              {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
            </span>
          </button>

          <div className="mt-8 text-gray-900 dark:text-white" style={{ color: 'var(--sidebar-text)' }}>
            <h1>Datos personales</h1>
          </div>

          <div>
            {
              sessionItems.map(elementItem => (
                <SidebarSessionItem
                  key={elementItem.path}
                  path={elementItem.path}
                  icon={elementItem.icon}
                  name={elementItem.name}
                />
              ))
            }
          </div>
        </div>
      </aside >
    </>
  )
}
