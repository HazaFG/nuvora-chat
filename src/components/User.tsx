'use client'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';

interface UserData {
  id: number
  name: string
  email: string
  password: string
  profile_picture: null
}

interface ApiResponse {
  message: string
  user: UserData
}

export const User = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const userId = Cookies.get('userId');
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: ApiResponse = await response.json()
        setUser(data.user)
      } catch (e: any) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return <div className="text-center mt-16">Cargando información del usuario...</div>
  }

  if (error) {
    return <div className="text-center mt-16 text-red-500">Error al cargar el usuario: {error.message}</div>
  }

  if (!user) {
    return <div className="text-center mt-16">No se encontró información del usuario.</div>
  }


  return (
    <div className="p-4 sm:ml-64">
      <div className="profile-container relative max-w-md mx-auto md:max-w-2xl mt-6 min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl mt-16">
        <div className="px-6">
          <div className="flex flex-wrap justify-center">
            <div className="w-full flex justify-center">
              <div className="relative group">
                <img
                  src="https://github.com/creativetimofficial/soft-ui-dashboard-tailwind/blob/main/build/assets/img/team-2.jpg?raw=true"
                  className="shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px] object-cover w-[150px] h-[150px]"
                  alt="Profile"
                  id="profile-picture-display"
                />

                <label
                  className="absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px] w-[150px] h-[150px] rounded-full flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-70 transition-opacity duration-300 cursor-pointer"
                >
                  <span className="text-white text-sm">Cambiar Imagen</span>
                  <input
                    id="profile-picture-upload"
                    type="file"
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

          <div className="mt-6 py-6 border-t border-slate-200 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4">
                <div className="font-light leading-relaxed text-slate-600 mb-4 space-y-4">
                  <p className='flex align-left text-user'>Editar datos personales</p>
                  <input
                    type="text"
                    name="name"
                    placeholder={user.name}
                    className="barras-texto-color w-full px-4 py-2 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 barras-texto"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder={user.email}
                    className="barras-texto-color w-full px-4 py-2 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 barras-texto"
                  />
                  <p className='flex align-left text-user'>Editar contraseña</p>

                  <input
                    type="password"
                    name="password"
                    placeholder='Contraseña'
                    className="barras-texto-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 barras-texto"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar contraseña"
                    className="barras-texto-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 barras-texto"
                  />
                  <p className='flex align-left text-user'>Ingresa tu contraseña para confirmar tus cambios</p>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Contraseña actual"
                    className="barras-texto-color w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 barras-texto"
                  />
                </div>

                <button
                  className="barras-texto text-user mt-4 px-6 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors mr-2"
                >Editar información</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >

  )
}
