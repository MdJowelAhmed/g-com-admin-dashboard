export type SubCategory = {
  id: string
  name: string
}

export type Category = {
  key: string
  name: string
  imageUrl: string
  subCategories: SubCategory[]
}

let subCategoryCounter = 1000
export const nextSubCategoryId = () => `sub-${++subCategoryCounter}`

export const initialCategories: Category[] = [
  {
    key: 'services',
    name: 'Services',
    imageUrl:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=750&fit=crop',
    subCategories: [
      { id: 's-1', name: 'Cleaning' },
      { id: 's-2', name: 'Repair' },
      { id: 's-3', name: 'Beauty & Wellness' },
      { id: 's-4', name: 'Plumbing' },
      { id: 's-5', name: 'Electrical' },
    ],
  },
  {
    key: 'stay',
    name: 'Stay',
    imageUrl:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=750&fit=crop',
    subCategories: [
      { id: 's-6', name: 'Hotels' },
      { id: 's-7', name: 'Hostels' },
      { id: 's-8', name: 'Resorts' },
      { id: 's-9', name: 'Apartments' },
    ],
  },
  {
    key: 'dine',
    name: 'Dine',
    imageUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=750&fit=crop',
    subCategories: [
      { id: 's-10', name: 'Restaurants' },
      { id: 's-11', name: 'Cafés' },
      { id: 's-12', name: 'Street Food' },
      { id: 's-13', name: 'Fine Dining' },
      { id: 's-14', name: 'Fast Food' },
    ],
  },
  {
    key: 'shops',
    name: 'Shops',
    imageUrl:
      'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=1200&h=750&fit=crop',
    subCategories: [
      { id: 's-15', name: 'Fashion' },
      { id: 's-16', name: 'Electronics' },
      { id: 's-17', name: 'Groceries' },
      { id: 's-18', name: 'Books' },
      { id: 's-19', name: 'Home Goods' },
    ],
  },
  {
    key: 'events',
    name: 'Events',
    imageUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=750&fit=crop',
    subCategories: [
      { id: 's-20', name: 'Concerts' },
      { id: 's-21', name: 'Festivals' },
      { id: 's-22', name: 'Workshops' },
      { id: 's-23', name: 'Meetups' },
      { id: 's-24', name: 'Conferences' },
    ],
  },
]
