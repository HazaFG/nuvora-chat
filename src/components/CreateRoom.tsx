'use client';

import React, { useState } from 'react';
import Spinner from './Spinner';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

export const CreateRoom = () => {
  const MAX_SUMMARY = 25
  const [roomName, setRoomName] = useState<string>('');
  const [roomSummary, setRoomSummary] = useState<string>('');
  const [roomImageBase64, setRoomImageBase64] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  //comprimir y convertir a Base64 (sin cambios)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const MAX_WIDTH = 450;
          const MAX_HEIGHT = 450;
          const JPEG_QUALITY = 0.6;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width / MAX_WIDTH > height / MAX_HEIGHT) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            } else {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error("No se pudo cargar."));
          }
          ctx.drawImage(img, 0, 0, width, height);

          const base64data = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
          const cleanBase64 = base64data.replace(/^data:image\/\w+;base64,/, '');
          resolve(cleanBase64);
        };
      };
    });
  };

  const handleJoinRoom = async (roomId: number) => {
    const currentUserId = Cookies.get('userId');
    if (currentUserId === null) {
      alert('Error: ID de usuario no disponible. Asegúrate de haber iniciado sesión.');
      return;
    }

    try {
      const response = await fetch(`https://nuvora-backend.onrender.com/api/rooms/join-room`, {
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

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Hubo un error al intentar unirse a la sala:', error.message);
        alert(`Error al unirse a la sala: ${error.message}`);
      } else {
        console.error('Hubo un error desconocido al intentar unirse a la sala:', error);
        alert('Error desconocido al unirse a la sala.');
      }
    }
  };


  // Manejador para el cambio del input de archivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormError(null);

      const MAX_ORIGINAL_FILE_SIZE_MB = 10;
      if (file.size > MAX_ORIGINAL_FILE_SIZE_MB * 1024 * 1024) {
        setFormError(`El archivo es demasiado grande. Debe ser menor de ${MAX_ORIGINAL_FILE_SIZE_MB}MB.`);
        return;
      }

      try {
        const compressedBase64 = await compressImage(file);
        setRoomImageBase64(compressedBase64); //guarda la Base64 limpia para enviar
        setPreviewImage(`data:image/jpeg;base64,${compressedBase64}`); //para la previsualizacion

      } catch (err: unknown) {
        console.error("Error al comprimir la imagen:", err);
        if (err instanceof Error) {
          setFormError(err.message || "Error al procesar la imagen para subir ");
        } else if (typeof err === 'string') {
          // Si el error es un string, úsalo directamente
          setFormError(err || "Error al procesar la imagen para subir ");
        } else {
          // Para cualquier otro tipo de error, proporciona un mensaje genérico
          setFormError("Error desconocido al procesar la imagen.");
        }
      }
    } else {
      setRoomImageBase64(null);
      setPreviewImage(null); //no img seleccionada, quitar previsualizacion
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    if (roomName.length > MAX_SUMMARY) {
      setLoading(false);
      toast.error(`El nombre no puede tener más de ${MAX_SUMMARY} carácteres`)
      return
    }


    if (roomSummary.length > MAX_SUMMARY) {
      setLoading(false);
      toast.error(`La descripción no puede tener más de ${MAX_SUMMARY} carácteres`)
      return
    }





    if (!roomName.trim()) {
      // setFormError("El nombre de la sala es obligatorio.");
      toast.error("El nombre de la sala es obligatorio.")
      setLoading(false);
      return;
    }

    if (!roomSummary) {
      setLoading(false);
      toast.error("La descripcion de la sala es obligatoria")
      return
    }


    const roomData = {
      name: roomName,
      summary: roomSummary,
      image: roomImageBase64,
    };

    try {
      const response = await fetch(`https://nuvora-backend.onrender.com/api/rooms/create-room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Error Al Crear Sala")
        return
      }

      setFormError(null);
      setRoomName('');
      setRoomSummary('');
      setRoomImageBase64(null);
      setPreviewImage(null);

      console.log('Sala creada correctamente.');
      toast.success("Se Creo la Sala Correctamente")

      if (data.roomId) {
        handleJoinRoom(data.roomId)
        //router.push(`/dashboard/rooms/${data.roomId}`); el result que me traigo de la consulta en backend, no se si funcione 
      } else {
        router.push('/dashboard'); //fallback si por alguna razon falla :'v
      }

    } catch (e: unknown) {
      console.error('Error al crear la sala:', e);
      if (e instanceof Error) { // Verifica si 'e' es una instancia de Error
        setFormError(e.message || 'Error en el servidor al crear la sala.');
        toast.error("Error en el servidor al crear la sala.")
      } else if (typeof e === 'string') {
        setFormError(e || 'Error en el servidor al crear la sala.');
        toast.error("Error en el servidor al crear la sala.")
      } else {
        // Si el error es de un tipo desconocido
        setFormError('Error desconocido al crear la sala.');
        toast.error("Error desconocido al crear la sala.")
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:ml-64">
      <div className="profile-container relative max-w-md mx-auto md:max-w-2xl mt-6 min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl mt-16">
        <div className="px-6">
          <div className="flex flex-wrap justify-center">
            <div className="w-full flex justify-center">
              <div className="relative group">
                <img
                  src={previewImage || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
                  className="shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-18 max-w-[150px] object-cover w-[150px] h-[150px]"
                  alt="Room Icon"
                  id="room-picture-display"
                />

                <label
                  className="absolute -m-16 -ml-20 lg:-ml-18 max-w-[150px] w-[150px] h-[150px] rounded-full flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-70 transition-opacity duration-300 cursor-pointer"
                >
                  <span className="text-white text-sm">Cambiar Icono</span>
                  <input
                    id="room-picture-upload"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <div className="w-full text-center mt-20">
              <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                <div className="p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-slate-700 text-user">Nueva Sala</span>
                  <span className="text-sm text-slate-400 text-user">Crea un espacio para tu comunidad</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-2">
            <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1 text-user">{roomName || 'Nombre de la Sala'}</h3>
            <div className="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
              <i className="fas fa-map-marker-alt mr-2 text-slate-400 opacity-75 text-user">{roomSummary || 'Descripción breve'}</i>
            </div>
          </div>

          {formError && <span className="text-red-500 text-sm mt-2 block">{formError}</span>}
          {loading ? <Spinner /> : ""}

          <form onSubmit={handleSubmit} className="mt-6 py-6 border-t border-slate-200 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4">
                <div className="font-light leading-relaxed text-slate-600 mb-4 space-y-4">
                  <p className='flex align-left text-user'>Información de la Sala</p>
                  <input
                    type="text"
                    name="roomName"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Nombre de la Sala"
                    className="barras-texto-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 barras-texto"
                  />
                  <textarea
                    name="roomSummary"
                    value={roomSummary}
                    onChange={(e) => setRoomSummary(e.target.value)}
                    placeholder="Descripción de la Sala"
                    rows={3}
                    className="barras-texto-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 barras-texto"
                  ></textarea>
                  {roomSummary.length + '/' + MAX_SUMMARY}
                </div>

                <button
                  type='submit'
                  className="cursor-pointer barras-texto text-user mt-4 px-6 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors mr-2"
                  disabled={loading}
                >Crear Sala</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div >
  );
};
