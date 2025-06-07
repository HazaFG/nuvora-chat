import ChatTemplate from "@/components/ChatTemplate";
import Link from "next/link";
import path from "path";

export default async function Rooms() {
  const response = await fetch("http://localhost:3000/api/rooms")
  const json = await response.json()
  const rooms = json.rooms
  return (
    <>
      <div className="p-4 sm:ml-64 h-screen">
        <div className="h-full">
          <div className="chat-container">
            <div className="chat-header h-full max-h-screen overflow-y-auto">
              <ul className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-1 md:gris-cols-1 gap-6 font-medium"> {/* Aumentamos el gap y el espacio entre tarjetas */}
                {rooms.map((room: any) => (
                  <li key={`${room.name}-${room.id}`}>
                    {/* Contenedor principal de la tarjeta, con un borde más suave y fondo oscuro */}
                    <div className="w-full p-6 bg-[var(--background)] rounded-xl shadow-lg flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left transition-all duration-300 hover:shadow-xl hover:border-gray-600">

                      {/* Contenedor de la imagen central superior para móviles, a la izquierda para desktop */}
                      <div className="mb-5 sm:mb-0 sm:me-6 flex justify-center w-full sm:w-auto">
                        <img
                          src={(room.image) ? `data:image/png;base64,${room.image}` : '/cloudWhite.png'}
                          alt={room.name}
                          className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 ring-4 ring-blue-300 ring-opacity-50" // Borde más llamativo y ring
                        />
                      </div>

                      {/* Contenido de la sala (nombre, descripción) y botón */}
                      <div className="flex flex-col items-center sm:items-start flex-grow">
                        <h5 className="mb-2 text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]"> {/* Título más grande y bold */}
                          {room.name}
                        </h5>
                        <p className="mb-6 text-base sm:text-lg text-gray-300 leading-relaxed line-clamp-3"> {/* Descripción más grande, mejor interlineado, y límite de líneas */}
                          {room.summary}
                        </p>

                        {/* Contenedor para el botón, alineado a la derecha en desktop */}
                        <div className="w-full flex justify-center sm:justify-end mt-auto"> {/* 'mt-auto' empuja el botón hacia abajo */}
                          <Link
                            href={`./rooms/${room.id}`}
                            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center justify-center transition-colors duration-200" // Botón más pequeño y con transiciones
                          >
                            <svg className="me-2 -ms-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                            </svg>
                            Unirse a la sala
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>)
} 
