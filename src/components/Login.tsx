'use client';

import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';
const BACKEND_LOGIN_URL = `${BACKEND_API_BASE_URL}/api/auth/login`;

export const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica del lado del cliente
    if (!email || !password) {
      setError('Por favor, ingresa tu correo electrónico y contraseña.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(BACKEND_LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
        return;
      }

      // por si el login jala bien
      if (data.token) {
        Cookies.set('token', data.token, { expires: 7, path: '/' }); //token por 7 días
        setSuccess('¡Inicio de sesión exitoso! Redirigiendo al dashboard...');

        //si todo sale bien va pal dashboard
        setTimeout(() => {
          router.push('/dashboard/main');
        }, 1500);
      } else {
        setError('Inicio de sesión exitoso, pero no se recibió el token de autenticación jaja tonto');
      }

    } catch (err) {
      console.error('Error al conectar con el servidor:', err);
      setError('No se pudo conectar con el servidor. Asegúrate de que el backend esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[170vh] lg:h-[180vh] md:h-[170vh] xl:h-[100vh] xl:overflow-hidden flex flex-col xl:flex-row">
      {/* Contenedor del Gradiente - Sección Izquierda */}
      <div className="flex-1 bg-gradient-to-b from-[#0C4A9D] to-[#47A6F9] text-white flex items-center p-8 flex-col h-screen lg:h-auto relative">

        {/* NUEVO DIV PARA AGRUPAR Y CENTRAR EL CONTENIDO FLEXIBLE */}
        <div className="flex flex-col items-center flex-1 justify-center">

          <h1 className="text-3xl mt-14 font-inter md:hidden lg:hidden">Bienvenido a</h1>
          <div className="relative
          w-24 h-24     /* Default (xs) - up to 639px */
          sm:w-32 sm:h-32 /* sm - 640px and up */
          md:w-48 md:h-48 /* md - 768px and up */
          lg:w-60 lg:h-60 /* lg - 1024px and up */
          xl:w-30 xl:h-30 /* xl - 1280px and up */
          2xl:w-70 2xl:h-70 /* 2xl - 1536px and up */
          mt-28
          sm:mt-38
          lg:mt-50
          xl:mt-45
          image-3xl
        ">
            <Image
              src="/cloudWhite.png"
              alt="Nuvora Chat logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl mt-6 font-madimi md:text-6xl 2xl:text-8xl">Nuvora chat</h1>

          <p className='mt-14 text-center font-normal md:text-2xl lg:px-8 lg:text-xl lg:text-3xl xl:text-3xl xl:px-12 2xl:px-34'>
            Conversaciones en tiempo real. Conexión sin límites. Diseñada para equipos, amigos y todos los que quieran estar conectados
          </p>

          {/*Oculto para pantallas menores a xl*/}
          <p className='hidden xl:block mt-80 text-xl'>Hecho con pasión y propósito.</p>

          {/* --- INICIO de la animación de flecha con Tailwind --- */}
          <div className="mt-24 md:mt-32 lg:mt-46 xl:hidden flex justify-center items-center">
            <svg className="w-20 h-20 text-white animate-bounce motion-reduce:animate-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>
          {/* --- FIN de la animación de flecha con Tailwind CSS --- */}

        </div> {/* FIN DEL NUEVO DIV */}

        {/* El SVG de las nubes se mantiene fuera del nuevo div, porque es absoluto */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden xl:hidden" style={{ height: '130px' }}>
          <svg
            viewBox="0 0 1440 130"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice" // evita deformaciones
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Fondo degradado azul */}
            <rect x="0" y="0" width="1440" height="130" fill="url(#bgGradient)" />

            {/* Nubes traseras difusas */}
            <g fill="#FFFFFF" fillOpacity="0.2">
              <circle cx="100" cy="100" r="60" />
              <circle cx="250" cy="110" r="70" />
              <circle cx="400" cy="95" r="65" />
              <circle cx="550" cy="105" r="80" />
              <circle cx="700" cy="90" r="70" />
              <circle cx="850" cy="110" r="75" />
              <circle cx="1000" cy="95" r="65" />
              <circle cx="1150" cy="105" r="80" />
              <circle cx="1300" cy="100" r="70" />
            </g>

            <g fill="#FFFFFF" fillOpacity="0.1">
              <circle cx="150" cy="115" r="60" />
              <circle cx="300" cy="100" r="70" />
              <circle cx="450" cy="110" r="60" />
              <circle cx="600" cy="95" r="75" />
              <circle cx="750" cy="105" r="65" />
              <circle cx="900" cy="100" r="70" />
              <circle cx="1050" cy="115" r="60" />
              <circle cx="1200" cy="90" r="75" />
              <circle cx="1350" cy="105" r="65" />
            </g>

            {/* Nubes frontales */}
            <g fill="#FFFFFF">
              {Array.from({ length: 11 }).map((_, i) => (
                <circle key={i} cx={i * 144} cy="130" r="90" />
              ))}
            </g>
          </svg>
        </div>

      </div> {/* FIN del Contenedor del Gradiente */}

      {/*Aqui va la imagen de la nube feik */}
      <div className="hidden xl:flex h-screen justify-start z-3">
        <Image
          src="/testing.svg"
          alt="Imagen test"
          fill
          className="object-contain -ml-14"
          sizes="(max-height: 100vh) 33vw, 33vh"
        />
      </div>

      {/* Sección derecha: contenedor del Formulario */}
      <div className="lg:flex-1 lg:bg-white bg-white flex flex-col items-center justify-center p-8 w-full">
        <div className="z-99 w-full md:max-w-lg lg:max-w-2xl xl:max-w-[40vw] 2xl:max-w-2xl ">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-700 mb-8 text-center">Inicia sesión</h1>

          {/* Mensajes de error/éxito */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit}>
            {/* Correo */}
            <label
              className="block text-gray-800 font-semibold mb-6 sm:text-xl lg:text-2xl lg:mb-4"
              htmlFor="email"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={email} // Conectado al estado
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-b-2 border-[#2090F3] focus:outline-none focus:border-blue-500 placeholder-gray-400 pb-4 mb-8 lg:mb-12 lg:text-2xl"
            />

            {/* Contraseña */}
            <label
              className="block text-gray-800 font-semibold mb-6 sm:text-xl lg:text-2xl lg:b-4"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password} // Conectado al estado
              onChange={(e) => setPassword(e.target.value)} // Actualiza el estado
              required // Hace el campo requerido
              className="w-full border-b-2 border-[#2090F3] focus:outline-none focus:border-blue-500 placeholder-gray-400 pb-4 mb-8 lg:mb-12 lg:text-2xl"
            />

            <div className="flex items-start mb-8">
              <input
                type="checkbox"
                className="mt-1 lg:w-5 lg:h-5 accent-[#2090F3]"
                id="rememberMe"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm lg:text-lg text-gray-600">
                Recordarme
              </label>
            </div>

            {/* Botones */}
            <div className="flex space-x-4 flex-col">
              <Link
                href="/register"
                className="bg-[#1694FA] text-white font-semibold px-6 py-2 rounded-3xl w-full text-center lg:py-6 lg:text-2xl block"
              >
                ¿Sin cuenta? Créala ya
              </Link>

              {/* Botón de Iniciar Sesión */}
              <button
                type="submit" // Importante: make it type="submit" for form submission
                disabled={loading}
                className="border border-gray-400 text-gray-400 font-semibold px-6 py-2 rounded-3xl w-full text-center lg:py-6 lg:text-2xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
              <p className="flex justify-center mt-52 xl:hidden sm:hidden">Hecho con pasión y propósito</p>
            </div>
          </form> {/* CIERRE DEL FORMULARIO */}
        </div>
      </div >
    </div>
  );
};
