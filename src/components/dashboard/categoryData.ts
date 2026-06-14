export type SubCategory = {
  id: string
  name: string
  status?: 'active' | 'archive'
}

export type Category = {
  key: string
  name: string
  imageUrl: string
  subCategories: SubCategory[]
}

export const CATEGORY_TO_API: Record<string, string> = {
  services: 'services',
  stay: 'stay',
  dine: 'dine',
  shops: 'shop',
  events: 'event',
}

export const API_TO_CATEGORY_KEY = Object.fromEntries(
  Object.entries(CATEGORY_TO_API).map(([key, api]) => [api, key]),
) as Record<string, string>

export const CATEGORY_IMAGES = [
  '/category/Frame.png',
  '/category/Frame (1).png',
  '/category/Frame (2).png',
  '/category/Frame (3).png',
  '/category/Frame (4).png',
] as const

export const initialCategories: Category[] = [
  {
    key: 'services',
    name: 'Services',
    imageUrl: CATEGORY_IMAGES[0],
    subCategories: [],
  },
  {
    key: 'stay',
    name: 'Stay',
    imageUrl: CATEGORY_IMAGES[1],
    subCategories: [],
  },
  {
    key: 'dine',
    name: 'Dine',
    imageUrl: CATEGORY_IMAGES[2],
    subCategories: [],
  },
  {
    key: 'shops',
    name: 'Shops',
    imageUrl: CATEGORY_IMAGES[3],
    subCategories: [],
  },
  {
    key: 'events',
    name: 'Events',
    imageUrl: CATEGORY_IMAGES[4],
    subCategories: [],
  },
]
