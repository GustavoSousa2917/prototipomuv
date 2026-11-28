import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router'

import PublicLayout from '../layouts/PublicLayout'
import AuthLayout from '../layouts/AuthLayout'
import Loading from '../components/feedback/Loading'
import AccessGuard from './AccessGuard'
import AutonomousProviderPage from '../pages/operational/AutonomousProviderPage'
import OrganizationPage from '../pages/operational/OrganizationPage'
import ProviderEntryPage from '../pages/operational/ProviderEntryPage'
import DemoAccountsPage from '../pages/dev/DemoAccountsPage'
import AccountPage from '../pages/auth/AccountPage'
import { accountRoute, autonomousRegistrationRoute, driverInvitationsRoute, driverProfessionalRoute, environmentRoutes, organizationRegistrationRoutes, serviceRegionsPath } from '../constants/environmentRoutes'

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

const DriverInvitationsPage = lazy(() => import('../pages/operational/DriverLinksPage').then((module) => ({ default: module.DriverInvitationsPage })))
const OrganizationDriversPage = lazy(() => import('../pages/operational/DriverLinksPage').then((module) => ({ default: module.OrganizationDriversPage })))
const ActiveDriverLinkPage = lazy(() => import('../pages/operational/DriverLinksPage').then((module) => ({ default: module.ActiveDriverLinkPage })))
const DriverProfessionalPage = lazy(() => import('../pages/auth/DriverProfessionalPage'))
const ProviderAuthorizationsPage = lazy(() => import('../pages/operational/ProviderAuthorizationsPage'))
const AdminAuthorizationsPage = lazy(() => import('../pages/operational/AdminAuthorizationsPage'))
const AdminAuthorizationDetailPage = lazy(() => import('../pages/operational/AdminAuthorizationDetailPage'))
const ServiceRegionsPage = lazy(() => import('../pages/operational/ServiceRegionsPage'))

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

      {import.meta.env.DEV && <Route path="/dev/contas" element={<DemoAccountsPage />} />}

      <Route path={accountRoute} element={
        <AccessGuard requirement={{ ownAccount: true }}><AccountPage /></AccessGuard>
      } />

      <Route path={driverProfessionalRoute} element={
        <AccessGuard requirement={{ ownAccount: true }}>
          <Suspense fallback={<Loading message="Carregando perfil profissional..." />}><DriverProfessionalPage /></Suspense>
        </AccessGuard>
      } />

      <Route path={driverInvitationsRoute} element={
        <AccessGuard requirement={{ capabilities: ['accessClient', 'accessAutonomous', 'accessCompany', 'accessCooperative', 'accessLinkedDriver'] }}>
          <Suspense fallback={<Loading message="Carregando convites..." />}><DriverInvitationsPage /></Suspense>
        </AccessGuard>
      } />

      <Route path={environmentRoutes.client + '/conta'} element={<Navigate to={accountRoute} replace />} />
      {(['company', 'cooperative'] as const).map((kind) => (
        <Route key={kind} path={organizationRegistrationRoutes[kind]} element={
          <AccessGuard requirement={{ capabilities: ['accessClient', 'accessAutonomous', 'accessCompany', 'accessCooperative', 'accessLinkedDriver'] }}>
            <OrganizationPage register={kind} />
          </AccessGuard>
        } />
      ))}

      {operationalProfiles.map(({ basePath }) => (
        <Route key={basePath} path={basePath + '/conta'} element={<Navigate to={accountRoute} replace />} />
      ))}

      {/* Ambiente do cliente */}

      <Route path={environmentRoutes.client} element={
        <AccessGuard requirement={{ capabilities: ['accessClient'] }}><ClientLayout /></AccessGuard>
      }>

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
          <AccessGuard requirement={{ capabilities: ['accessClient', 'accessAutonomous', 'accessCompany', 'accessCooperative', 'accessLinkedDriver'] }}>
            <ProviderEntryPage />
          </AccessGuard>
        }
      />

      <Route
        path={autonomousRegistrationRoute}
        element={
          <AccessGuard requirement={{ capabilities: ['accessClient', 'accessAutonomous', 'accessCompany', 'accessCooperative', 'accessLinkedDriver'] }}>
            <AutonomousProviderPage create />
          </AccessGuard>
        }
      />

      {operationalProfiles.map((config) => (
        <Route
          key={config.profile}
          path={config.basePath}
          element={
            <AccessGuard requirement={{ capabilities: [config.capability] }}>
              <ProfileOperationalLayout config={config} />
            </AccessGuard>
          }
        >

          {(config.profile === 'autonomous' || config.profile === 'company' || config.profile === 'cooperative') && (
            <Route path={serviceRegionsPath} element={
              <Suspense fallback={<Loading message="Carregando regiões de atendimento..." />}>
                <ServiceRegionsPage profile={config.profile} />
              </Suspense>
            } />
          )}

          {config.profile === 'admin' && <Route path="autorizacoes/:id" element={
            <Suspense fallback={<Loading message="Carregando tentativa..." />}><AdminAuthorizationDetailPage /></Suspense>
          } />}

          {config.pages.map((page) => {
            let element = (
              <OperationalPlaceholderPage
                title={page.label}
                description={page.description}
                areaLabel={config.areaLabel}
              />
            )

            if (page.path === 'motoristas' && (config.profile === 'company' || config.profile === 'cooperative')) {
              element = <Suspense fallback={<Loading message="Carregando motoristas..." />}><OrganizationDriversPage /></Suspense>
            }
            if (config.capability === 'accessLinkedDriver' && (page.path === 'vinculos' || page.path === '')) {
              element = <Suspense fallback={<Loading message="Carregando vínculo..." />}><ActiveDriverLinkPage /></Suspense>
            }

            if (page.path === 'autorizacoes') {
              if (config.profile === 'admin') {
                element = <Suspense fallback={<Loading message="Carregando autorizações..." />}><AdminAuthorizationsPage /></Suspense>
              }
              if (config.profile === 'autonomous' || config.profile === 'company' || config.profile === 'cooperative') {
                element = <Suspense fallback={<Loading message="Carregando autorizações..." />}><ProviderAuthorizationsPage profile={config.profile} /></Suspense>
              }
            }

            if (page.path === 'perfil') {
              if (config.profile === 'autonomous') element = <AutonomousProviderPage />
              if (config.profile === 'company' || config.profile === 'cooperative') element = <OrganizationPage />
            }

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