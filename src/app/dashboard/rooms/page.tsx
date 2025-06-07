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
          <ul className="space-y-2 font-medium">
            {rooms.map((room: any) =>
              <li key={`${room.name}-${room.id}`}>
                <Link
                  href={`./rooms/${room.id}`}
                  className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white group sidebar-menu-item-link`}
                >
                  <img
                    src={(room.image) ? `data:image/png;base64,${room.image}` : '/cloudWhite.png'}
                    alt="Logo"
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <span className="ms-3" style={{ color: 'var(--sidebar-text)' }}>{room.name}</span>
                </Link>
              </li>)
            }
          </ul>
        </div>
      </div>
    </>
  )
}
