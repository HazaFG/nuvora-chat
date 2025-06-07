// Si estás usando React, asegúrate de importar 'React' si es necesario
// import React from 'react';

export default function MainPage() {
  return (
    <>
      {/* Contenedor principal con todas las variables CSS y estilos Tailwind */}
      {/* Las variables se definen directamente en el className usando corchetes */}
      <div className="
        p-4 sm:ml-64 min-h-screen flex flex-col items-center justify-between relative overflow-hidden
        text-white

        bg-gradient-to-br from-[#0C4A9D] to-[#47A6F9]

        transition-colors duration-500 ease-in-out

        /* Variables de modo claro */
        [--cloud-color:white]
        [--star-color:transparent] /* Las estrellas son transparentes en modo claro */


        /* Variables de modo oscuro (se aplican solo cuando html tiene la clase 'dark') */
        dark:from-[#120A45]
        dark:to-[#2A0E63]
        dark:[--cloud-color:rgba(255,255,255,0.1)] /* Nubes tenues en modo oscuro */
        dark:[--star-color:rgba(255,255,255,0.8)] /* Estrellas visibles en modo oscuro */
      ">

        {/* El color de la nube se toma de la variable --cloud-color */}
        <div className="animated-clouds">
          <div className="cloud cloud-1" style={{ backgroundColor: 'var(--cloud-color)' }}></div>
          <div className="cloud cloud-2" style={{ backgroundColor: 'var(--cloud-color)' }}></div>
          <div className="cloud cloud-3" style={{ backgroundColor: 'var(--cloud-color)' }}></div>
          <div className="cloud cloud-4" style={{ backgroundColor: 'var(--cloud-color)' }}></div>
          <div className="cloud cloud-5" style={{ backgroundColor: 'var(--cloud-color)' }}></div>
        </div>

        {/* Usamos un div separado para las estrellas y su background-image compleja */}
        <div className="animated-stars"></div>


        {/* Contenido principal (imagen y texto de bienvenida) */}
        <div className="flex flex-col items-center justify-center flex-grow z-10">
          <div className="mb-8 sm:mt-0">
            <img
              src="/cloudWhite.png"
              alt="Nuvora Chat Cloud Icon"
              className="w-32 h-auto sm:w-48 md:w-64 lg:w-60 max-w-full mx-auto animate-fade-in-down-slow"
            />
          </div>

          <div className="text-center px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4
                           leading-tight animate-fade-in-down">
              ¡Bienvenido a <span className="font-madimi">Nuvora Chat!</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-8
                          leading-relaxed animate-fade-in-up">
              Conversaciones en tiempo real. Conexión sin límites.
            </p>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl animate-fade-in">
              Diseñada para equipos, amigos y todos los que quieran estar conectados.
            </p>
          </div>
        </div>

        {/* Div para los nombres de los integrantes en la parte inferior */}
        <div className="text-center px-4 mb-4 z-10">
          <p className="text-xs sm:text-sm md:text-base lg:text-lg animate-fade-in-late-fast">
            HazaelFG, AndreaLT, MarcosIG, AgusAM
          </p>
        </div>
      </div>
    </>
  )
}
