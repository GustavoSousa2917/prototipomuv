import { Routes, Route } from 'react-router'

import PublicLayout from '../layouts/PublicLayout'

import HomePage from '../pages/public/HomePage'
import PublicPlaceholderPage from '../pages/public/PublicPlaceholderPage'

import EnvironmentPage from '../pages/dev/EnvironmentPage'
import NavigationTestPage from '../pages/dev/NavigationTestPage'
import DesignSystemPage from '../pages/dev/DesignSystemPage'

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

    </Routes>
  )
}