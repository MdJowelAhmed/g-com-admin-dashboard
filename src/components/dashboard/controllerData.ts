/** API permission keys matching backend ADMIN_PERMISSIONS */
export const ADMIN_PERMISSIONS = {
  DASHBOARD_OVERVIEW: 'dashboard_overview',
  USER_MANAGEMENT: 'user_management',
  BUSINESS_MANAGEMENT: 'business_management',
  CATEGORIES: 'categories',
  SETTINGS: 'settings',
  SUPPORT: 'support',
  PROMOTIONS: 'promotions',
  EVENTS_MANAGEMENT: 'events_management',
  ORDERS_MANAGEMENT: 'orders_management',
  PAYOUTS_MANAGEMENT: 'payouts_management',
} as const

export type ControllerPermissionKey =
  (typeof ADMIN_PERMISSIONS)[keyof typeof ADMIN_PERMISSIONS]

/** Display labels shown in Controller form (page names) */
export const PAGE_PERMISSIONS = [
  'Dashboard Overview',
  'User Management',
  'Business Management',
  'Categories',
  'Settings',
  'Support',
  'Promotions',
  'Events Management',
  'Orders Management',
  'Payouts Management',
] as const

export type PagePermission = (typeof PAGE_PERMISSIONS)[number]

export const PERMISSION_TO_API: Record<PagePermission, ControllerPermissionKey> =
  {
    'Dashboard Overview': ADMIN_PERMISSIONS.DASHBOARD_OVERVIEW,
    'User Management': ADMIN_PERMISSIONS.USER_MANAGEMENT,
    'Business Management': ADMIN_PERMISSIONS.BUSINESS_MANAGEMENT,
    Categories: ADMIN_PERMISSIONS.CATEGORIES,
    Settings: ADMIN_PERMISSIONS.SETTINGS,
    Support: ADMIN_PERMISSIONS.SUPPORT,
    Promotions: ADMIN_PERMISSIONS.PROMOTIONS,
    'Events Management': ADMIN_PERMISSIONS.EVENTS_MANAGEMENT,
    'Orders Management': ADMIN_PERMISSIONS.ORDERS_MANAGEMENT,
    'Payouts Management': ADMIN_PERMISSIONS.PAYOUTS_MANAGEMENT,
  }

export const API_TO_PERMISSION = Object.fromEntries(
  Object.entries(PERMISSION_TO_API).map(([label, key]) => [key, label]),
) as Record<string, PagePermission>

export type Controller = {
  key: string
  sl: string
  name: string
  email: string
  pageAccess: PagePermission[]
  suspended: boolean
}

let counter = 2000
export const nextControllerKey = () => `c-${++counter}`

export const initialControllers: Controller[] = [
  {
    key: '1',
    sl: '01',
    name: 'sabbir ahmed',
    email: 'asabbir724@gmail.com',
    pageAccess: ['Business Management', 'Payouts Management'],
    suspended: false,
  },
  {
    key: '2',
    sl: '02',
    name: 'lina martinez',
    email: 'lina.martinez@gmail.com',
    pageAccess: ['Promotions', 'Dashboard Overview', 'Settings'],
    suspended: false,
  },
  {
    key: '3',
    sl: '03',
    name: 'omar farouk',
    email: 'omar.farouk@yahoo.com',
    pageAccess: ['Orders Management', 'Categories'],
    suspended: true,
  },
  {
    key: '4',
    sl: '04',
    name: 'maya chen',
    email: 'maya.chen@outlook.com',
    pageAccess: ['User Management', 'Dashboard Overview'],
    suspended: false,
  },
]
