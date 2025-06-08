'use client';

import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { toast } from 'sonner';

interface Room {
  id: number;
  name: string;
  summary: string;
  image?: string;
}

interface RoomListClientProps {
  rooms: Room[];
}

export default function RoomListClient({ rooms: initialRooms }: RoomListClientProps) {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const userIdCookie = Cookies.get('userId');
    if (userIdCookie) {
      setCurrentUserId(parseInt(userIdCookie, 10));
    } else {
      console.warn("Cookie 'userId' no encontrada. El usuario podría no estar autenticado.");
      // router.push('/login');
    }
  }, []);

  const handleJoinRoom = async (roomId: number) => {
    if (currentUserId === null) {
      alert('Error: ID de usuario no disponible. Asegúrate de haber iniciado sesión.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/rooms/join-room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('authToken')}`,
        },
        body: JSON.stringify({
          userId: currentUserId,
          roomId: roomId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al unirse a la sala.');
      }

      const result = await response.json();
      console.log('Unido a la sala con éxito:', result)
      window.location.href = `/dashboard/rooms/${roomId}`;

    } catch (e: unknown) {
      console.error('Error capturado al intentar unirse a la sala:', e);
      if (e instanceof Error) {
        toast.error(`Error al intentar unirse a la sala: ${e.message}`);
      } else {
        toast.error('Error al intentar unirse a la sala.');
      }
    }
  };

  return (
    <ul className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6 font-medium">
      {initialRooms.map((room: Room) => (
        <li key={`${room.name}-${room.id}`}>
          <div className="w-full p-6 bg-[var(--background)] rounded-xl shadow-lg flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left transition-all duration-300 hover:shadow-xl hover:border-gray-600">
            <div className="mb-5 sm:mb-0 sm:me-6 flex justify-center w-full sm:w-auto">
              <img
                src={(room.image) ? `data:image/png;base64,${room.image}` : '/cloudWhite.png'}
                alt={room.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 ring-4 ring-blue-300 ring-opacity-50"
              />
            </div>
            <div className="flex flex-col items-center sm:items-start flex-grow">
              <h5 className="mb-2 text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
                {room.name}
              </h5>
              <p className="mb-6 text-base sm:text-lg text-gray-300 leading-relaxed line-clamp-3">
                {room.summary}
              </p>
              <div className="w-full flex justify-center sm:justify-end mt-auto">
                <button
                  onClick={() => handleJoinRoom(room.id)}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-400 inline-flex items-center justify-center transition-colors duration-200"
                >
                  <svg className="me-2 -ms-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                  </svg>
                  Unirse a la sala
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
