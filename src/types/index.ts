export interface GameType {
  id: string
  slug: string
  name: string
  description: string | null
  icon: string | null
  banner: string | null
  thumbnail: string | null
  category: string | null
  popular: boolean
  active: boolean
  nominals: NominalType[]
}

export interface NominalType {
  id: string
  gameId: string
  name: string
  amount: number
  price: number
  originalPrice: number | null
  active: boolean
}

export interface PaymentMethodType {
  id: string
  name: string
  type: string
  icon: string | null
  active: boolean
}

export interface PromoType {
  id: string
  code: string
  name: string
  description: string | null
  discount: number
  discountType: string
  minPurchase: number | null
  maxDiscount: number | null
  maxUses: number | null
  usedCount: number
  startDate: string | null
  endDate: string | null
  active: boolean
}

export interface BannerType {
  id: string
  title: string
  subtitle: string | null
  image: string | null
  link: string | null
  position: number
  active: boolean
}

export interface OrderType {
  id: string
  invoice: string
  userId: string
  gameId: string
  nominalId: string
  paymentMethodId: string | null
  playerId: string
  playerNickname: string | null
  amount: number
  fee: number
  total: number
  status: string
  paymentProof: string | null
  promoCode: string | null
  discountAmount: number
  createdAt: string
  updatedAt: string
  paidAt: string | null
  game?: GameType
  nominal?: NominalType
  paymentMethod?: PaymentMethodType
}

export interface UserType {
  id: string
  email: string
  username: string
  name: string | null
  role: string
  avatar: string | null
  phone: string | null
  createdAt: string
}

export interface AuditLogType {
  id: string
  userId: string
  action: string
  entity: string
  entityId: string | null
  details: string | null
  ip: string | null
  createdAt: string
  user?: { username: string; email: string }
}

export interface FAQType {
  id: string
  question: string
  answer: string
  category: string | null
  position: number
  active: boolean
}

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  pendingOrders: number
  successOrders: number
  recentOrders: OrderType[]
  popularGames: { name: string; count: number; revenue: number }[]
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: string
}
