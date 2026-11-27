import { Routes, Route, Navigate } from 'react-router'

import PublicLayout from '../layouts/PublicLayout'
import AuthLayout from '../layouts/AuthLayout'

import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'

import NotFoundPage from '../pages/errors/NotFoundPage'

import HomePage from '../pages/public/HomePage'
import PublicPlaceholderPage from '../pages/public/PublicPlaceholderPage'

import EnvironmentPage from '../pages/dev/EnvironmentPage'
import NavigationTestPage from '../pages/dev/NavigationTestPage'
import DesignSystemPage from '../pages/dev/DesignSystemPage'
import ClientLayout from '../layouts/ClientLayout'
import ClientPlaceholderPage from '../pages/client/ClientPlaceholderPage'
import OperationalLayoutDemo, {
  OperationalPreviewPage,
} from '../pages/dev/OperationalLayoutDemo'
import ProfileOperationalLayout
  from '../layouts/ProfileOperationalLayout'

import OperationalPlaceholderPage
  from '../pages/operational/OperationalPlaceholderPage'

import {
  operationalProfiles,
} from '../constants/operationalNavigation'

export default function AppRoutes() {
  return (
    <Routes>

      {/* Ambiente público */}

      <Route element={<PublicLayout />}>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/termos-de-uso"
          element={
            <PublicPlaceholderPage
              title="Termos de uso"
              description="Informações sobre as condições de utilização da plataforma."
            />
          }
        />

        <Route
          path="/privacidade"
          element={
            <PublicPlaceholderPage
              title="Política de privacidade"
              description="Informações sobre privacidade e tratamento de dados."
            />
          }
        />

      </Route>

      {/* Ambiente de autenticação */}

      <Route element={<AuthLayout />}>

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/cadastro"
          element={<RegisterPage />}
        />

        <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />

        <Route path="/redefinir-senha" element={<ResetPasswordPage />} />

      </Route>

      {/* Ambiente de desenvolvimento */}

      <Route
        path="/dev/environment"
        element={<EnvironmentPage />}
      />

      <Route
        path="/teste"
        element={<NavigationTestPage />}
      />

      <Route
        path="/dev/design-system"
        element={<DesignSystemPage />}
      />

      {/* Ambiente do cliente */}

      <Route path="/cliente" element={<ClientLayout />}>

        <Route
          index
          element={
            <Navigate
              to="/cliente/solicitar-frete"
              replace
            />
          }
        />

        <Route
          path="solicitar-frete"
          element={
            <ClientPlaceholderPage
              title="Solicitar frete"
              description="Solicite serviços de transporte de pessoas ou encomendas."
            />
          }
        />

        <Route
          path="prestadores"
          element={
            <ClientPlaceholderPage
              title="Prestadores"
              description="Encontre prestadores autorizados para atender à sua solicitação."
            />
          }
        />

        <Route
          path="solicitacoes"
          element={
            <ClientPlaceholderPage
              title="Minhas solicitações"
              description="Acompanhe suas solicitações e analise as propostas recebidas."
            />
          }
        />

        <Route
          path="fretes"
          element={
            <ClientPlaceholderPage
              title="Meus fretes"
              description="Acompanhe seus serviços de frete contratados."
            />
          }
        />

        <Route
          path="historico"
          element={
            <ClientPlaceholderPage
              title="Histórico"
              description="Consulte o histórico dos seus serviços de frete."
            />
          }
        />

        <Route
          path="notificacoes"
          element={
            <ClientPlaceholderPage
              title="Notificações"
              description="Acompanhe os acontecimentos relacionados aos seus serviços."
            />
          }
        />

        <Route
          path="conta"
          element={
            <ClientPlaceholderPage
              title="Minha conta"
              description="Gerencie suas informações pessoais e configurações."
            />
          }
        />

        <Route
          path="seja-prestador"
          element={
            <ClientPlaceholderPage
              title="Seja prestador"
              description="Solicite autorização para oferecer serviços de frete pelo MUV."
            />
          }
        />

      </Route>

      {/* Ambientes operacionais por perfil */}

      <Route
        path="/prestador"
        element={
          <Navigate
            to="/prestador/autonomo"
            replace
          />
        }
      />

      {operationalProfiles.map((config) => (
        <Route
          key={config.profile}
          path={config.basePath}
          element={
            <ProfileOperationalLayout
              config={config}
            />
          }
        >

          {config.pages.map((page) => {
            const element = (
              <OperationalPlaceholderPage
                title={page.label}
                description={page.description}
                areaLabel={config.areaLabel}
              />
            )

            if (page.path === '') {
              return (
                <Route
                  key="index"
                  index
                  element={element}
                />
              )
            }

            return (
              <Route
                key={page.path}
                path={page.path}
                element={element}
              />
            )
          })}

          <Route
            path="conta"
            element={
              <OperationalPlaceholderPage
                title="Minha conta"
                description="Gerencie suas informações pessoais e configurações."
                areaLabel={config.areaLabel}
              />
            }
          />

          <Route
            path="notificacoes"
            element={
              <OperationalPlaceholderPage
                title="Notificações"
                description="Acompanhe os acontecimentos relacionados às suas atividades."
                areaLabel={config.areaLabel}
              />
            }
          />

        </Route>
      ))}

      {/* Demonstração do layout operacional */}

      <Route
        path="/dev/operational-layout"
        element={<OperationalLayoutDemo />}
      >
        <Route
          index
          element={
            <OperationalPreviewPage
              title="Visão geral"
              description="Acompanhe as informações do ambiente operacional."
            />
          }
        />

        <Route
          path="fretes"
          element={
            <OperationalPreviewPage
              title="Fretes"
              description="Acompanhe os serviços de frete."
            />
          }
        />

        <Route
          path="conta"
          element={
            <OperationalPreviewPage
              title="Minha conta"
              description="Gerencie suas informações pessoais."
            />
          }
        />

        <Route
          path="notificacoes"
          element={
            <OperationalPreviewPage
              title="Notificações"
              description="Acompanhe os acontecimentos do ambiente operacional."
            />
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  )
}