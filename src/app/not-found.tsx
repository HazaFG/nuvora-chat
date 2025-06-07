import Link from "next/link";
import Image from 'next/image'

export default function NotFound() {
  return (
    <>
      <main className="grid min-h-full h-[100vh] place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <Image src={'/cloudWhite.png'} alt="Nuvora Chat" width={100} height={100} className="mx-auto" />
          {/* <p className="text-base font-semibold text-[#1694FA] indigo-600">404</p> */}
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            Página no encontrada
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Lo sentimos, no encontramos el sitio que buscas
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/dashboard/main"
              className="rounded-md bg-[#1694FA] px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Volver
            </Link>
            <Link href="/dashboard/users" className="text-sm font-semibold text-gray-900">
              Ir a mi perfil <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
