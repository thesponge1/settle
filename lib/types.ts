export type Category =
  | 'Eating Out'
  | 'Travel'
  | 'Health & Body'
  | 'Home & Living'
  | 'Joy'
  | 'Creating'
  | 'Other'

export const CATEGORIES: Category[] = [
  'Eating Out',
  'Travel',
  'Health & Body',
  'Home & Living',
  'Joy',
  'Creating',
  'Other',
]

export const CATEGORY_COLORS: Record<Category, string> = {
  'Eating Out':    '#C4A882',
  'Travel':        '#8BA8A0',
  'Health & Body': '#A89BB5',
  'Home & Living': '#B5A48A',
  'Joy':           '#C4A882',
  'Creating':      '#9BB5A8',
  'Other':         '#A8A8A8',
}

export interface Entry {
  id: string
  user_id: string
  amount: number
  category: Category
  note: string | null
  date: string          // ISO date string YYYY-MM-DD
  created_at: string
}

export interface NewEntry {
  amount: number
  category: Category
  note?: string
  date: string
}
