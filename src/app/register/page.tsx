import Image from 'next/image'


export default function RegisterPage() {
  return (
    <>
      <div className="h-[170vh] lg:h-[100vh] flex flex-col lg:flex-row">
        <div className="flex-1 bg-gradient-to-b from-[#0C4A9D] to-[#47A6F9] text-white flex items-center p-8 flex-col h-screen lg:h-auto relative">
          <h1 className="text-3xl mt-14 font-inter">Bienvenido a</h1>
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-60 lg:h-60 xl:w-72 xl:h-72 mt-28">
  <Image
    src="/cloudWhite.png"
    alt="Nuvora Chat logo"
    fill
    className="object-contain"
    sizes="(max-width: 768px) 96px, (max-width: 1280px) 218px, 218px"
  />
</div>
 
          <h1 className="text-4xl mt-6 font-madimi">Nuvora chat</h1>



          <p className='mt-14 text-center'>Conversaciones en tiempo real. Conexión sin límites.
            Diseñada para equipos, amigos y todos los que quieran estar conectados</p>

          {/* --- INICIO de la animación de flecha con Tailwind --- */}
          <div className="mt-24 flex justify-center items-center">
            <svg className="w-20 h-20 text-white animate-bounce motion-reduce:animate-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>
          {/* --- FIN de la animación de flecha con Tailwind CSS --- */}

          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden" style={{ height: '130px' }}>
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

        {/* Sección derecha: background gris en mobile, blanco en desktop */} 
        <div className="lg:flex-1 lg:bg-white flex flex-col items-center justify-center p-8 w-full">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-bold text-gray-700 mb-8 text-center">
              Crea tu cuenta
            </h1>

            {/* Nombre */}
            <label
              className="block text-gray-800 font-semibold mb-1"
              htmlFor="name"
            >
              Nombre
            </label>
            <input
              id="name"
              type="text"
              placeholder="Ingresa tu nombre"
              className="w-full border-b-2 border-blue-500 focus:outline-none focus:border-blue-500 placeholder-gray-400 mb-6"
            />

            {/* Correo */}
            <label
              className="block text-gray-800 font-semibold mb-1"
              htmlFor="email"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              className="w-full border-b-2 border-blue-500 focus:outline-none focus:border-blue-500 placeholder-gray-400 mb-6"
            />

            {/* Contraseña */}
            <label
              className="block text-gray-800 font-semibold mb-1"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              className="w-full border-b-2 border-blue-500 focus:outline-none focus:border-blue-500 placeholder-gray-400 mb-6"
            />

            {/* Checkbox */}
            <div className="flex items-start mb-6">
              <input
                type="checkbox"
                className="mt-1 accent-blue-500"
                id="terms"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                Al marcar aceptas nuestros{" "}
                <span className="text-blue-500 font-medium">
                  Términos y condiciones
                </span>
              </label>
            </div>

            {/* Botones */}
            <div className="flex space-x-4">
              <button className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg w-full">
                Crear cuenta
              </button>
              <button className="border border-gray-400 text-gray-400 font-semibold px-6 py-2 rounded-lg w-full cursor-not-allowed">
                Iniciar sesión
              </button>
            </div>
            <p className = "flex justify-center mt-52">HazaelFG | AndreaLT</p>
          </div>
        </div>
      </div>
    </>
  )
}
