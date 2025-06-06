'use client'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import Spinner from './Spinner';

interface UserData {
  id: number
  name: string
  email: string
  password: string
  confirm_password: string
  profile_picture: string

}

interface ApiResponse {
  message: string
  user: UserData
}

export const User = () => {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [formError, setFormError] = useState<Error | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const userId = Cookies.get('userId');

    if (!userId) {
      setLoading(false);
      setError(new Error("Inicia sesion prro"));
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: ApiResponse = await response.json()
        setUser(data.user)

        if (data.user.profile_picture) {
          setPreviewImage(`data:image/jpeg;base64,${data.user.profile_picture}`);
        } else {
          setPreviewImage("https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg");
        }

      } catch (e: any) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return <Spinner />; // Se retorna el Spinner directamente, ocupando toda la pantalla
  }

  if (error) {
    return <div className="text-center mt-16 text-red-500">Error al cargar el usuario: {error.message}</div>
  }


  if (!user) {
    return <div className="text-center mt-16">No se encontró información del usuario.</div>
  }

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

        img.onerror = (err) => reject(new Error("Error al comprimir."));
      };

      reader.onerror = (err) => reject(new Error("Error al leer el archivo."));
    });
  };

  //cambio del input de archivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormError(null); // Limpia errores anteriores

      const MAX_ORIGINAL_FILE_SIZE_MB = 5;
      if (file.size > MAX_ORIGINAL_FILE_SIZE_MB * 1024 * 1024) {
        setFormError(`El archivo original es demasiado grande. Debe ser menor de ${MAX_ORIGINAL_FILE_SIZE_MB}MB.`);
        return;
      }

      try {
        const compressedBase64 = await compressImage(file);

        //asigna la Base64 comprimida al estado del usuario
        setUser(prevUser => prevUser ? { ...prevUser, profile_picture: compressedBase64 } : null);

        //upd previsualizacion con el Base64 comprimido (con prefijo para display)
        setPreviewImage(`data:image/jpeg;base64,${compressedBase64}`);

      } catch (err: any) {
        console.error("Error al comprimir la imagen:", err);
        setFormError(err.message || "Error al procesar la imagen para subir.");
      }
    } else {

      //si no se selecciona archivo pone img por defecto o la q tenia antes, opc como si no lo updteas
      setPreviewImage(user.profile_picture ? `data:image/jpeg;base64,${user.profile_picture}` : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg");
      setUser(prevUser => prevUser ? { ...prevUser, profile_picture: user.profile_picture } : null);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null); // Limpiar errores antes de enviar

    if (user.password && user.password !== user.confirm_password) {
      setFormError("Las contraseñas no coinciden.");
      return;
    }

    const userDataToUpdate: Partial<UserData> = {
      name: user.name,
      email: user.email,
    };

    if (user.password) {
      userDataToUpdate.password = user.password;
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
      const response = await fetch(`http://localhost:3000/api/users/update/${user.id}`, requestOptions);
      const json = await response.json();

      if (!response.ok) {
        setFormError(json.message || "Error desconocido al actualizar.");
        return;
      } else {
        Cookies.set('name', user.name, { expires: 7, path: '/' });

        location.reload();
      }
    } catch (e: any) {
      console.error("Error en la petición de actualización:", e);
      setFormError(e.message || "Error de red al actualizar.");
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
                  src={`data:image/jpg;base64,${user.profile_picture}` || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
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

          {(formError) ? <span>{formError.message}</span> : ""}
          <form onSubmit={handleSubmit} className="mt-6 py-6 border-t border-slate-200 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4">
                <div className="font-light leading-relaxed text-slate-600 mb-4 space-y-4">
                  <p className='flex align-left text-user'>Editar datos personales</p>
                  <input
                    type="text"
                    name="name"
                    onChange={(e) => { setUser({ ...user, name: e.target.value }) }}
                    placeholder={user.name}
                    className="barras-texto-color w-full px-4 py-2 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 barras-texto"
                  />
                  <input
                    type="email"
                    name="email"
                    onChange={(e) => { setUser({ ...user, email: e.target.value }) }}
                    placeholder={user.email}
                    className="barras-texto-color w-full px-4 py-2 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 barras-texto"
                  />
                  <p className='flex align-left text-user'>Editar contraseña</p>

                  <input
                    type="password"
                    name="password"
                    onChange={(e) => { setUser({ ...user, password: e.target.value }) }}
                    placeholder='Contraseña'
                    className="barras-texto-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 barras-texto"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    onChange={(e) => { setUser({ ...user, confirm_password: e.target.value }) }}
                    placeholder="Confirmar contraseña"
                    className="barras-texto-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 barras-texto"
                  />

                </div>

                <button
                  type='submit'
                  className="cursor-pointer barras-texto text-user mt-4 px-6 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors mr-2"
                >Editar información</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div >

  )
}
