import { Link } from 'react-router'
import { Globe } from 'lucide-react'

import Logo from '../common/Logo'

const footerGroups = [
  {
    title: 'Comece por aqui',
    links: [
      {
        label: 'Como funciona',
        to: '/#como-funciona',
      },
      {
        label: 'Para prestadores',
        to: '/#para-prestadores',
      },
    ],
  },
  {
    title: 'Informações',
    links: [
      {
        label: 'Dúvidas frequentes',
        to: '/#duvidas',
      },
      {
        label: 'Termos de uso',
        to: '/termos-de-uso',
      },
      {
        label: 'Política de privacidade',
        to: '/privacidade',
      },
    ],
  },
  {
    title: 'Sua conta',
    links: [
      {
        label: 'Entrar',
        to: '/login',
      },
      {
        label: 'Criar conta',
        to: '/cadastro',
      },
    ],
  },
]

export default function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-surface">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div
          className="
            grid gap-10 py-12
            sm:grid-cols-2
            lg:grid-cols-[2fr_1fr_1fr_1fr]
          "
        >
          {/* Identidade institucional */}

          <div>
            <Link
              to="/"
              aria-label="MUV — Página inicial"
            >
              <Logo size="md" />
            </Link>

            <p className="mt-4 max-w-xs leading-relaxed text-muted">
              Conectando pessoas, encomendas e destinos.
            </p>
          </div>

          {/* Grupos de navegação */}

          {footerGroups.map((group) => (
            <nav
              key={group.title}
              aria-label={group.title}
            >
              <h2 className="font-semibold text-foreground">
                {group.title}
              </h2>

              <ul className="mt-4 space-y-3">

                {group.links.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="
                        text-muted transition-colors
                        hover:text-primary
                        hover:underline
                      "
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}

              </ul>
            </nav>
          ))}

        </div>

        {/* Informações finais */}

        <div
          className="
            flex flex-col gap-4
            border-t border-border
            py-6 text-muv-small text-muted
            sm:flex-row sm:items-center
            sm:justify-between
          "
        >
          <p>
            © {currentYear} MUV. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-2">
            <Globe size={15} aria-hidden="true" />
            Português (Brasil)
          </div>

        </div>

      </div>

    </footer>
  )
}