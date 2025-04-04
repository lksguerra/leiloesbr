export type AuctionType = 'judicial' | 'extrajudicial'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  created_at: string
}

export interface Auction {
  id: string
  title: string
  description: string
  type: AuctionType
  starting_price: number
  current_price: number
  end_date: string
  status: 'active' | 'ended' | 'cancelled'
  location: string
  category: string
  created_by: string
  created_at: string
  updated_at: string
  images?: string[]
  image_url?: string
  address?: string
  area?: number
  bedrooms?: number
  bathrooms?: number
  parking_spots?: number
  is_favorite?: boolean
  link_acesso?: string
  first_auction_date: string
  second_auction_date: string
}

export interface Bid {
  id: string
  auction_id: string
  user_id: string
  amount: number
  created_at: string
}

export interface Category {
  id: string
  name: string
  description: string
  created_at: string
} 