import { Truck, CircleCheck, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

export default function EnvironmentPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">

      <section className="w-full max-w-xl rounded-2xl bg-white p-10 text-center shadow-sm">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1B695C] text-white">
          <Truck size={40} />
        </div>

        <h1 className="text-5xl font-bold text-[#1B695C]">
          MUV
        </h1>

        <p className="mt-3 text-lg text-gray-600">
          Conectando pessoas, encomendas e destinos.
        </p>

        <div className="my-8 border-t border-gray-200" />

        <div className="flex items-center justify-center gap-2 text-[#1B695C]">
          <CircleCheck size={22} />

          <span className="font-medium">
            Ambiente configurado com sucesso
          </span>
        </div>

        <Link
          to="/teste"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B695C] px-6 py-3 font-medium text-white transition-colors hover:bg-[#145247]"
        >
          Testar navegação
          <ArrowRight size={18} />
        </Link>

        <p className="mt-6 text-sm text-gray-500">
          Protótipo navegável — Ambiente de desenvolvimento
        </p>

        <p className="mt-2 text-xs text-gray-400">
          Versão 0.1.0
        </p>

      </section>

    </main>
  )
}