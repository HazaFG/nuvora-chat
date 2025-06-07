export default function MainPage() {
  return (
    <>
      <div className="p-4 sm:ml-64 min-h-screen flex flex-col items-center justify-center relative overflow-hidden
                      bg-[var(--welcome-gradient-from)] to-[var(--welcome-gradient-to)] bg-gradient-to-br text-white">

        {/* Contenedor de las nubes animadas */}
        {/* Las nubes tienen su color definido en CSS con var(--cloud-color) */}
        <div className="animated-clouds">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
          <div className="cloud cloud-4"></div>
          <div className="cloud cloud-5"></div>
        </div>

        {/* Contenedor de las estrellas animadas (solo visible en modo oscuro) */}
        <div className="animated-stars"></div>


        <div className="mb-8 mt-4 sm:mt-0 z-10">
          <img
            src="/cloudWhite.png"
            alt="Nuvora Chat Cloud Icon"
            className="w-32 h-auto sm:w-48 md:w-64 lg:w-60 max-w-full mx-auto animate-fade-in-down-slow"
          />
        </div>

        <div className="text-center px-4 z-10">
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
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mt-8 animate-fade-in-late">
            Hecho con pasión y propósito.
          </p>
        </div>
      </div>
    </>
  )
}
