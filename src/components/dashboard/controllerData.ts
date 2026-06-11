export const PAGE_PERMISSIONS = [
  'Dashboard',
  'User Management',
  'Business Management',
  'Categories',
  'Payments',
  'Settings',
  'Support',
  'Promotions',
] as const

export type PagePermission = (typeof PAGE_PERMISSIONS)[number]

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
    pageAccess: ['Business Management', 'Payments'],
    suspended: false,
  },
  {
    key: '2',
    sl: '02',
    name: 'lina martinez',
    email: 'lina.martinez@gmail.com',
    pageAccess: ['Promotions', 'Dashboard', 'Settings'],
    suspended: false,
  },
  {
    key: '3',
    sl: '03',
    name: 'omar farouk',
    email: 'omar.farouk@yahoo.com',
    pageAccess: ['Payments', 'Categories'],
    suspended: true,
  },
  {
    key: '4',
    sl: '04',
    name: 'maya chen',
    email: 'maya.chen@outlook.com',
    pageAccess: ['User Management', 'Dashboard'],
    suspended: false,
  },
]
