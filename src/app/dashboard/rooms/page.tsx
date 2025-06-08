import RoomListClient from "@/components/RoomListClient";

export default async function Rooms() {
  return (
    <>
      <div className="p-4 sm:ml-64 h-screen">
        <div className="h-full">
          <div className="chat-container">
            <div className="chat-header h-full max-h-screen overflow-y-auto">
              {/* Usa el nuevo Client Component aquí, pasándole las rooms */}
              <RoomListClient />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
