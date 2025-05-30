import Image from 'next/image'


export default function RegisterPage() {
  return (
    <>
      <div className="h-[170vh] lg:h-[180vh] md:h-[170vh] xl:h-[100vh] flex flex-col xl:flex-row">
        <div className="flex-1 bg-gradient-to-b from-[#0C4A9D] to-[#47A6F9] text-white flex items-center p-8 flex-col h-screen lg:h-auto relative">
          <h1 className="text-3xl mt-14 font-inter md:hidden lg:hidden">Bienvenido a</h1>
          <div className="relative 
          w-24 h-24       /* Default (xs) - up to 639px */
          sm:w-32 sm:h-32 /* sm - 640px and up */
          md:w-48 md:h-48 /* md - 768px and up */
          lg:w-60 lg:h-60 /* lg - 1024px and up */
          xl:w-30 xl:h-30 /* xl - 1280px and up */
          2xl:w-50 2xl:h-50 /* 2xl - 1536px and up */
          mt-28
          sm:mt-38
          lg:mt-68
          xl:mt-45
            ">
            <Image
              src="/cloudWhite.png"
              alt="Nuvora Chat logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl mt-6 font-madimi md:text-6xl">Nuvora chat</h1>



          <p className='mt-14 text-center md:text-2xl lg:px-8 lg:text-xl lg:text-3xl xl:text-3xl xl:px-12'>Conversaciones en tiempo real. Conexión sin límites.
            Diseñada para equipos, amigos y todos los que quieran estar conectados</p>

          {/* --- INICIO de la animación de flecha con Tailwind --- */}
          <div className="mt-24 md:mt-32 lg:mt-46 xl:hidden flex justify-center items-center">
            <svg className="w-20 h-20 text-white animate-bounce motion-reduce:animate-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>
          {/* --- FIN de la animación de flecha con Tailwind CSS --- */}

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
        </div>
        
        {/*Aqui va la imagen de la nube feik*/}

<div className="hidden xl:flex h-screen justify-start">
  <Image
    src="/testing.png"
    alt="Imagen test"
    fill
    className="object-contain -ml-14"
    sizes="(max-height: 100vh) 33vw, 33vh"
  />
</div>


        {/* Sección derecha: background gris en mobile, blanco en desktop */}
        <div className="lg:flex-1 lg:bg-white flex flex-col items-center justify-center p-8 w-full">
          <div className="w-full md:max-w-lg lg:max-w-2xl xl:max-w-xl 2xl:max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-700 mb-8 text-center">
              Crea tu cuenta
            </h1>

            {/* Nombre */}
            <label
              className="block text-gray-800  font-semibold mb-1 md:text-xl lg:text-2xl lg:mb-4"
              htmlFor="name"
            >
              Nombre
            </label>
            <input
              id="name"
              type="text"
              placeholder="Ingresa tu nombre"
              className="w-full border-b-2 border-blue-500 focus:outline-none focus:border-blue-500 placeholder-gray-400 mb-8 lg:mb-12 lg:text-2xl"
            />

            {/* Correo */}
            <label
              className="block text-gray-800 font-semibold mb-1 sm:text-xl lg:text-2xl lg:mb-4"
              htmlFor="email"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              className="w-full border-b-2 border-blue-500 focus:outline-none focus:border-blue-500 placeholder-gray-400 mb-8 lg:mb-12 lg:text-2xl"
            />

            {/* Contraseña */}
            <label
              className="block text-gray-800 font-semibold mb-1 sm:text-xl lg:text-2xl lg:b-4"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              className="w-full border-b-2 border-blue-500 focus:outline-none focus:border-blue-500 placeholder-gray-400 mb-8 lg:mb-12 lg:text-2xl"
            />

            {/* Checkbox */}
            <div className="flex items-start mb-8">
              <input
                type="checkbox"
                className="mt-1 lg:w-5 lg:h-5 accent-blue-500"
                id="terms"
              />
              <label htmlFor="terms" className="ml-2 text-sm lg:text-lg text-gray-600">
                Al marcar aceptas nuestros{" "}
                <span className="text-blue-500 font-medium">
                  Términos y condiciones
                </span>
              </label>
            </div>

            {/* Botones */}
            <div className="flex space-x-4">
              <button className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg w-full lg:py-6 lg:text-xl">
                Crear cuenta
              </button>
              <button className="border border-gray-400 text-gray-400 font-semibold px-6 py-2 rounded-lg w-full cursor-not-allowed lg:py-6 lg:text-xl">
                Iniciar sesión
              </button>
            </div>
            <p className="flex justify-center mt-52 xl:hidden">HazaelFG | AndreaLT</p>
          </div>
        </div>
      </div>
    </>
  )
}
