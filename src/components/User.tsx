'use client'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { toast } from 'sonner';

interface UserData {
  id?: number
  name?: string
  email?: string
  profile_picture?: string
  password?: string // Added password field for potential update
}

interface ApiResponse {
  message: string
  user: UserData
}

const BACKEND_API_BASE_URL = "https://nuvora-backend.onrender.com";

export const User = () => {
  const [user, setUser] = useState<UserData | null>(null)
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

  // Validar si las contraseñas coinciden o si están vacías cuando una de ellas está llena
  const passwordsMatch = newPassword === confirmNewPassword;
  const isPasswordSectionActive = newPassword !== '' || confirmNewPassword !== '';
  const isEditButtonDisabled = isPasswordSectionActive && !passwordsMatch;


  useEffect(() => {
    const userId = Cookies.get('userId');

    if (!userId) {
      toast.error("Inicia sesión.");
      return;
    }
  })

  useEffect(() => {
    const userId = Cookies.get('userId');

    if (!userId) {
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`${BACKEND_API_BASE_URL}/api/users/${userId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setUser(data.user);

      } catch (e: unknown) {
        console.error("Error en la actualización de datos:", e);

        if (e instanceof Error) {
          toast.error(e.message || "Error al actualizar datos.");
        } else {
          toast.error("Error al actualizar datos.");
        }
      }
    };

    fetchUser();
  }, []);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); //leer el archivo como Data URL

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          //dimensiones maximas y calidad deseada para la foto de perfil
          const MAX_WIDTH = 400; //maximo de 400px de ancho
          const MAX_HEIGHT = 400; //maximo de 400px de alto
          const JPEG_QUALITY = 0.8; //calidad JPEG (0.1 a 1.0, 0.8 es un buen balance perooo se puede najar)

          //redimensiona la imagen si es mas grande que lo maximo de arriba
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width > height) {
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
            return reject(new Error("No se pudo obtener el contexto del canvas."));
          }
          ctx.drawImage(img, 0, 0, width, height);

          //bbtener la imagen redimensionada y comprimida como Base64 (sin el prefijo)
          const base64data = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
          const cleanBase64 = base64data.replace(/^data:image\/\w+;base64,/, '');
          resolve(cleanBase64); //base64 limpia
        };

        img.onerror = (e) => reject(new Error(`Error al comprimir, ${e}`));
      };

      reader.onerror = (e) => reject(new Error(`Error al leer el archivo, ${e}`));
    });
  };

  //cambio del input de archivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      return
    }

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      const MAX_ORIGINAL_FILE_SIZE_MB = 5;
      if (file.size > MAX_ORIGINAL_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`El archivo original es demasiado grande. Debe ser menor de ${MAX_ORIGINAL_FILE_SIZE_MB}MB.`)
        return;
      }

      try {
        const compressedBase64 = await compressImage(file);

        //asigna la Base64 comprimida al estado del usuario
        setUser(prevUser => prevUser ? { ...prevUser, profile_picture: compressedBase64 } : null);

        //upd previsualizacion con el Base64 comprimido (con prefijo para display)
      } catch (e: unknown) {
        console.error("Error al comprimir la imagen:", e);

        if (e instanceof Error) {
          toast.error(e.message || "Error al procesar la imagen para subir.");
        } else {
          toast.error("Error al procesar la imagen para subir.");
        }
      }
    } else {
      //si no se selecciona archivo pone img por defecto o la q tenia antes, opc como si no lo updteas
      setUser(prevUser => prevUser ? { ...prevUser, profile_picture: user.profile_picture } : null);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!user) {
      toast.error("Datos de usuario no disponibles.");
      return;
    }
    e.preventDefault();

    if (newPassword || confirmNewPassword) {
      if (!newPassword || !confirmNewPassword) {
        toast.error("Ambos campos de contraseña deben llenarse para cambiarla.");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        toast.error("Las contraseñas no coinciden.");
        return;
      }
      if (newPassword.length < 6) {
        toast.error("La nueva contraseña debe tener al menos 6 caracteres.");
        return;
      }
    }

    const userDataToUpdate: Partial<UserData> = {
      name: user.name,
      email: user.email,
    };

    if (newPassword) {
      userDataToUpdate.password = newPassword;
    }

    if (user.profile_picture) {
      userDataToUpdate.profile_picture = user.profile_picture;
    }

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userDataToUpdate)
    };

    handleUserUpdate(requestOptions);
  }

  async function handleUserUpdate(requestOptions: RequestInit) {
    try {
      const response = await fetch(`${BACKEND_API_BASE_URL}/api/users/update/${user?.id}`, requestOptions);
      const jsonResponse = await response.json();

      if (!response.ok) {
        throw new Error(jsonResponse.message || "Error desconocido al actualizar.");
      }

      Cookies.set('name', user?.name || "NONAME", { expires: 7, path: '/' });

      toast.success("Informacion actualizada correctamente.")

      setNewPassword('');
      setConfirmNewPassword('');

    } catch (e: unknown) {
      console.error("Error en la peticion de actualizacion", e);

      toast.error("Error en la peticion de actualizacion");
    }
  }

  return (
    <div className="p-4 sm:ml-64">
      <div className="profile-container relative max-w-md mx-auto md:max-w-2xl mt-6 min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl mt-16">
        <div className="px-6">
          <div className="flex flex-wrap justify-center">
            <div className="w-full flex justify-center">
              <div className="relative group">
                <img
                  src={(user?.profile_picture) ? `data:image/jpg;base64,${user?.profile_picture}` : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
                  className="shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-18 max-w-[150px] object-cover w-[150px] h-[150px]"
                  alt="Profile"
                  id="profile-picture-display"
                />

                <label
                  className="absolute -m-16 -ml-20 lg:-ml-18 max-w-[150px] w-[150px] h-[150px] rounded-full flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-70 transition-opacity duration-300 cursor-pointer"
                >
                  <span className="text-white text-sm">Cambiar Imagen</span>
                  <input
                    id="profile-picture-upload"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
            </div>            <div className="w-full text-center mt-20">
              <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                <div className="p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-slate-700 text-user">{user?.id}</span>
                  <span className="text-sm text-slate-400 text-user">Id del Usuario</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-2">
            <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1 text-user">{user?.name}</h3>
            <div className="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
              <i className="fas fa-map-marker-alt mr-2 text-slate-400 opacity-75 text-user">{user?.email}</i>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 py-6 border-t border-slate-200 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4">
                <div className="font-light leading-relaxed text-slate-600 mb-4 space-y-4">
                  <p className='flex align-left text-user'>Editar datos personales</p>
                  <input
                    type="text"
                    name="name"
                    onChange={(e) => { setUser({ ...user, name: e.target.value }) }}
                    placeholder={user?.name}
                    className="barras-texto-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 barras-texto"
                  />
                  <input
                    type="email"
                    name="email"
                    onChange={(e) => { setUser({ ...user, email: e.target.value }) }}
                    placeholder={user?.email}
                    className="barras-texto-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 barras-texto"
                  />
                  <p className='flex align-left text-user'>Editar contraseña</p>

                  <input
                    type="password"
                    name="password"
                    onChange={(e) => setNewPassword(e.target.value)} // Updated to use setNewPassword
                    placeholder='Contraseña'
                    value={newPassword} // Controlled component
                    className="barras-texto-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 barras-texto"
                    autoComplete="new-password"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    onChange={(e) => setConfirmNewPassword(e.target.value)} // Updated to use setConfirmNewPassword
                    placeholder="Confirmar contraseña"
                    value={confirmNewPassword} // Controlled component
                    className="barras-texto-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 barras-texto"
                    autoComplete="new-password"
                  />
                  {!passwordsMatch && isPasswordSectionActive && (
                    <p className="text-red-500 text-sm mt-1">Las contraseñas no coinciden.</p>
                  )}
                </div>

                <button
                  type='submit'
                  disabled={isEditButtonDisabled} // This is the key change
                  className={`cursor-pointer barras-texto text-user mt-4 px-6 py-2 rounded-lg font-bold transition-colors mr-2 ${isEditButtonDisabled ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >Editar información</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div >

  )
}
