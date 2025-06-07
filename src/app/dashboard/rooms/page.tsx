import RoomListClient from "@/components/RoomListClient";

export default async function Rooms() {
  const response = await fetch("http://localhost:3000/api/rooms");
  const json = await response.json();
  const rooms = json.rooms;

  return (
    <>
      <div className="p-4 sm:ml-64 h-screen">
        <div className="h-full">
          <div className="chat-container">
            <div className="chat-header h-full max-h-screen overflow-y-auto">
              {/* Usa el nuevo Client Component aquí, pasándole las rooms */}
              <RoomListClient rooms={rooms} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
