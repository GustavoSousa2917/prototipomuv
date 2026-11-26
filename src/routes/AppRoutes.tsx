import { Routes, Route } from 'react-router'

import EnvironmentPage from '../pages/dev/EnvironmentPage'
import NavigationTestPage from '../pages/dev/NavigationTestPage'
import DesignSystemPage from '../pages/dev/DesignSystemPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
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