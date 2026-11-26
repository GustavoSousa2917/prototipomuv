import { CircleCheck, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

export default function NavigationTestPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">

      <section className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-sm">

        <CircleCheck
          size={64}
          className="mx-auto mb-5 text-[#1B695C]"
        />

        <h1 className="text-3xl font-bold text-[#1B695C]">
          Navegação funcionando!
        </h1>

        <p className="mt-4 text-gray-600">
          O React Router está configurado corretamente.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#1B695C] px-6 py-3 text-white transition-colors hover:bg-[#145247]"
        >
          <ArrowLeft size={18} />
          Voltar ao início
        </Link>

      </section>

    </main>
  )
}