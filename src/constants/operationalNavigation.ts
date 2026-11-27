import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  Car,
  Users,
  DollarSign,
  History,
  MessageSquare,
  Package,
  ShieldCheck,
  Star,
  Building2,
  UserRound,
  Link2,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

export type OperationalProfile =
  | 'autonomous'
  | 'company'
  | 'cooperative'
  | 'driver'
  | 'admin'

export type OperationalPageDefinition = {
  path: string
  label: string
  description: string
  icon: LucideIcon
}

export type OperationalProfileConfig = {
  profile: OperationalProfile
  basePath: string
  areaLabel: string
  userName: string
  profileLabel: string
  canAccessClientArea: boolean
  pages: readonly OperationalPageDefinition[]
}

const providerPages: OperationalPageDefinition[] = [
  {
    path: '',
    label: 'Visão geral',
    description:
      'Acompanhe os indicadores e as atividades do prestador.',
    icon: LayoutDashboard,
  },
  {
    path: 'solicitacoes',
    label: 'Solicitações',
    description:
      'Acompanhe solicitações direcionadas e abertas e gerencie suas propostas.',
    icon: ClipboardList,
  },
  {
    path: 'fretes',
    label: 'Fretes',
    description:
      'Gerencie os serviços de frete contratados.',
    icon: Truck,
  },
  {
    path: 'veiculos',
    label: 'Veículos',
    description:
      'Gerencie os veículos cadastrados e sua disponibilidade operacional.',
    icon: Car,
  },
  {
    path: 'tarifas',
    label: 'Tarifas',
    description:
      'Configure os valores por modalidade e categoria de veículo.',
    icon: DollarSign,
  },
  {
    path: 'historico',
    label: 'Histórico',
    description:
      'Consulte o histórico dos serviços e das atividades realizadas.',
    icon: History,
  },
  {
    path: 'contestacoes',
    label: 'Contestações',
    description:
      'Acompanhe e responda às contestações recebidas.',
    icon: MessageSquare,
  },
  {
    path: 'achados-e-perdidos',
    label: 'Achados e perdidos',
    description:
      'Gerencie os registros de objetos encontrados.',
    icon: Package,
  },
  {
    path: 'autorizacoes',
    label: 'Autorizações',
    description:
      'Acompanhe suas autorizações por modalidade de serviço.',
    icon: ShieldCheck,
  },
  {
    path: 'avaliacoes',
    label: 'Avaliações',
    description:
      'Consulte as avaliações recebidas pelos serviços concluídos.',
    icon: Star,
  },
  {
    path: 'perfil',
    label: 'Perfil do prestador',
    description:
      'Gerencie as informações apresentadas aos clientes.',
    icon: Building2,
  },
]

const driversPage: OperationalPageDefinition = {
  path: 'motoristas',
  label: 'Motoristas',
  description:
    'Gerencie convites, vínculos e verificações dos motoristas.',
  icon: Users,
}

const organizationPages: OperationalPageDefinition[] = [
  ...providerPages.slice(0, 4),
  driversPage,
  ...providerPages.slice(4),
]

export const operationalProfiles: readonly OperationalProfileConfig[] = [
  {
    profile: 'autonomous',
    basePath: '/prestador/autonomo',
    areaLabel: 'Área do prestador',
    userName: 'João Ferreira',
    profileLabel: 'Prestador autônomo',
    canAccessClientArea: true,
    pages: providerPages,
  },
  {
    profile: 'company',
    basePath: '/prestador/empresa',
    areaLabel: 'Área da empresa',
    userName: 'Transportadora Sertão',
    profileLabel: 'Empresa de transporte',
    canAccessClientArea: true,
    pages: organizationPages,
  },
  {
    profile: 'cooperative',
    basePath: '/prestador/cooperativa',
    areaLabel: 'Área da cooperativa',
    userName: 'Cooperativa Caminhos',
    profileLabel: 'Cooperativa de transporte',
    canAccessClientArea: true,
    pages: organizationPages,
  },
  {
    profile: 'driver',
    basePath: '/motorista',
    areaLabel: 'Área do motorista',
    userName: 'Carlos Santos',
    profileLabel: 'Motorista vinculado',
    canAccessClientArea: true,
    pages: [
      {
        path: '',
        label: 'Visão geral',
        description:
          'Acompanhe suas atividades e os fretes designados.',
        icon: LayoutDashboard,
      },
      {
        path: 'fretes',
        label: 'Meus fretes',
        description:
          'Consulte os serviços de frete sob sua responsabilidade.',
        icon: Truck,
      },
      {
        path: 'historico',
        label: 'Histórico',
        description:
          'Consulte os serviços executados anteriormente.',
        icon: History,
      },
      {
        path: 'vinculos',
        label: 'Meus vínculos',
        description:
          'Acompanhe seus convites e vínculos com prestadores.',
        icon: Link2,
      },
    ],
  },
  {
    profile: 'admin',
    basePath: '/admin',
    areaLabel: 'Área administrativa',
    userName: 'Ana Oliveira',
    profileLabel: 'Administrador',
    canAccessClientArea: false,
    pages: [
      {
        path: '',
        label: 'Visão geral',
        description:
          'Acompanhe os indicadores administrativos da plataforma.',
        icon: LayoutDashboard,
      },
      {
        path: 'usuarios',
        label: 'Usuários',
        description:
          'Consulte os usuários cadastrados na plataforma.',
        icon: UserRound,
      },
      {
        path: 'prestadores',
        label: 'Prestadores',
        description:
          'Acompanhe os prestadores cadastrados no MUV.',
        icon: Building2,
      },
      {
        path: 'autorizacoes',
        label: 'Autorizações',
        description:
          'Analise as solicitações de autorização dos prestadores.',
        icon: ShieldCheck,
      },
      {
        path: 'motoristas',
        label: 'Motoristas',
        description:
          'Consulte os cadastros e vínculos dos motoristas.',
        icon: Users,
      },
      {
        path: 'fretes',
        label: 'Fretes',
        description:
          'Consulte os serviços de frete registrados.',
        icon: Truck,
      },
      {
        path: 'contestacoes',
        label: 'Contestações',
        description:
          'Acompanhe as contestações registradas na plataforma.',
        icon: MessageSquare,
      },
    ],
  },
]