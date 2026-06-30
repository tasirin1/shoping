// ============================================================
// Core Data Types
// ============================================================

export interface User {
  id: string
  email: string
  username: string
  password: string
  name: string | null
  role: "USER" | "ADMIN"
  avatar: string | null
  phone: string | null
  suspended: boolean
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  token: string
  userId: string
  expiresAt: string
  createdAt: string
  user?: User
}

export interface Game {
  id: string
  slug: string
  name: string
  description: string | null
  icon: string | null
  banner: string | null
  thumbnail: string | null
  categoryId: string | null
  categoryName: string | null
  popular: boolean
  active: boolean
  sortOrder: number
  providerId: string | null
  promoLabel: string | null
  createdAt: string
  updatedAt: string
  nominals?: Product[]
  categoryRel?: Category | null
}

export interface Product {
  id: string
  gameId: string
  name: string
  amount: number
  price: number
  originalPrice: number | null
  costPrice: number | null
  profit: number | null
  stock: number
  active: boolean
  productCode: string | null
  createdAt: string
  updatedAt: string
  game?: Game | null
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  active: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  _count?: { games: number }
}

export interface Provider {
  id: string
  name: string
  baseUrl: string | null
  apiKey: string | null
  apiSecret: string | null
  merchantId: string | null
  signature: string | null
  active: boolean
  sandbox: boolean
  createdAt: string
  updatedAt: string
  _count?: { games: number }
}

export interface Order {
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
  status: "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED"
  paymentProof: string | null
  promoCode: string | null
  discountAmount: number
  note: string | null
  createdAt: string
  updatedAt: string
  paidAt: string | null
  game?: Game | null
  nominal?: Product | null
  user?: { id: string; username: string } | null
  paymentMethod?: PaymentMethod | null
}

export interface PaymentMethod {
  id: string
  name: string
  type: string
  icon: string | null
  accountNumber: string | null
  accountName: string | null
  active: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Promo {
  id: string
  code: string
  name: string
  description: string | null
  discount: number
  discountType: "PERCENTAGE" | "NOMINAL"
  minPurchase: number | null
  maxDiscount: number | null
  maxUses: number | null
  usedCount: number
  startDate: string | null
  endDate: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Banner {
  id: string
  title: string
  subtitle: string | null
  image: string | null
  link: string | null
  position: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface SiteSetting {
  createdAt: string
  updatedAt: string
  id: string
  key: string
  value: string
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  entity: string
  entityId: string | null
  details: string | null
  ip: string | null
  createdAt: string
  user?: { username: string; email: string } | null
}

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  pendingOrders: number
  successOrders: number
  recentOrders: Order[]
  popularGames: { name: string; count: number; revenue: number }[]
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: string
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Re-export with old names for backward compatibility
export type GameType = Game
export type NominalType = Product
export type PaymentMethodType = PaymentMethod
export type PromoType = Promo
export type BannerType = Banner
export type OrderType = Order
export type UserType = User

// ============================================================
// Theme Types
// ============================================================

export interface ThemeConfig {
  // Brand
  logo: string
  logoDark: string
  favicon: string
  siteName: string
  tagline: string

  // Colors
  primaryColor: string
  secondaryColor: string
  accentColor: string
  buttonColor: string
  navbarColor: string
  footerColor: string
  backgroundColor: string
  cardColor: string
  textColor: string
  linkColor: string
  successColor: string
  warningColor: string
  errorColor: string

  // Style
  borderRadius: string
  shadow: string
  fontFamily: string
  headingFont: string

  // Content
  heroImage: string
  bannerHome: string
  websiteIcon: string
  footerText: string
  copyright: string

  // Social
  socialFacebook: string
  socialTwitter: string
  socialInstagram: string
  socialYoutube: string

  // Preset
  preset: string
}

export type ThemePresetName = "default" | "blue" | "dark" | "emerald" | "purple" | "orange"

export interface ThemePreset {
  name: string
  slug: ThemePresetName
  label: string
  colors: Partial<ThemeConfig>
}
