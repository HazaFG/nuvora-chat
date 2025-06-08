"use client";

import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';

interface Room {
  id: number;
  name: string;
  summary: string;
  image: string | null;
}

export const SidebarRoomItem = () => {
  // useState with explicit boolean type
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // useRef with HTMLElement type for DOM elements, initialized to null
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState<boolean>(true);
  const [errorRooms, setErrorRooms] = useState<string | null>(null);

  const currentUserId = Cookies.get('userId');

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Close drozdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Type assertion for event.target to Node to use contains()
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener for mousedown
    //document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Explicitly type the users array
  useEffect(() => {
    const fetchJoinedRooms = async () => {
      if (!currentUserId) {
        // No hay un usuario autenticado, no hay salas que buscar
        setLoadingRooms(false);
        setJoinedRooms([]);
        return;
      }

      setLoadingRooms(true);
      setErrorRooms(null); // Resetear cualquier error anterior

      try {
        const response = await fetch(`https://nuvora-backend.onrender.com/api/rooms/user-rooms/${currentUserId}`);
        const data = await response.json();
        if (!response.ok) {
          // Si la respuesta no es 200 OK, lanzamos un error
          throw new Error(data.message || 'Error al cargar las salas unidas.');
        }

        // Si la respuesta es exitosa pero rooms está vacío, data.rooms ya es []
        setJoinedRooms(data.rooms);
      } catch (e: unknown) { 
        console.error('Error fetching joined rooms:', e);
        
        if (e instanceof Error) {
          setErrorRooms(e.message || 'No se pudieron cargar tus salas.');
        } else {
          
          setErrorRooms('Ocurrió un error inesperado al cargar tus salas.');
        }
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchJoinedRooms();
    // La dependencia es currentUserId para recargar si el usuario cambia (ej. al iniciar sesión)
  }, [currentUserId]);

  return (
    <>
      <button
        id="dropdownUsersButton"
        ref={buttonRef}
        onClick={toggleDropdown}
        style={{ color: 'var(--sidebar-text)' }}
        type="button"
        className="cursor-pointer flex p-2 mt-1 text-gray-900 rounded-lg dark:text-white group sidebar-menu-item-link w-full"
      >
        <IoChatboxEllipsesOutline size={24} className="shrink-0 w-5 h-5 mr-2.5 transition duration-75 menu-icon" />
        Mis chats{' '}
        <svg
          className="w-3 h-3 ms-4 mt-[0.5vh]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>

      <div
        id="dropdownUsers"
        ref={dropdownRef}
        className={`z-10 bg-white rounded-lg shadow-sm w-60 dark:bg-[var(--sidebar-box)] ${isDropdownOpen ? 'block' : 'hidden'}`}
      >
        <ul className="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">
          {loadingRooms && (
            <li className="px-4 py-2 text-center text-gray-500">Cargando tus salas...</li>
          )}

          {errorRooms && (
            <li className="px-4 py-2 text-center text-red-500">Error: {errorRooms}</li>
          )}

          {!loadingRooms && joinedRooms.length === 0 && !errorRooms && (
            <li className="px-4 py-2 text-center text-gray-500">No te has unido a ninguna sala aún.</li>
          )}

          {!loadingRooms && !errorRooms && joinedRooms.map((room) => (
            <li key={room.id}>
              <Link href={`/dashboard/rooms/${room.id}`} className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-[var(--background)] dark:hover:text-white">
                <Image
                  className="w-6 h-6 me-2 rounded-full object-cover" // Added object-cover
                  src={room.image ? `data:image/jpeg;base64,${room.image}` : "/cloudWhite.png"} // Fallback image
                  alt={`${room.name} image`}
                  width={24}
                  height={24}
                />
                {room.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
