import { Routes, Route, Navigate } from 'react-router'

import PublicLayout from '../layouts/PublicLayout'

import HomePage from '../pages/public/HomePage'
import PublicPlaceholderPage from '../pages/public/PublicPlaceholderPage'

import EnvironmentPage from '../pages/dev/EnvironmentPage'
import NavigationTestPage from '../pages/dev/NavigationTestPage'
import DesignSystemPage from '../pages/dev/DesignSystemPage'
import ClientLayout from '../layouts/ClientLayout'
import ClientPlaceholderPage from '../pages/client/ClientPlaceholderPage'

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
          path="/login"
          element={
            <PublicPlaceholderPage
              title="Entrar"
              description="Acesse sua conta no MUV."
            />
          }
        />

        <Route
          path="/cadastro"
          element={
            <PublicPlaceholderPage
              title="Criar conta"
              description="Comece sua experiência no MUV."
            />
          }
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

    </Routes>    
  )
}