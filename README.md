# Shoping - Top Up Game Website

Platform top up game modern, elegan, dan cepat. Dibangun dengan Next.js, TypeScript, Tailwind CSS, Prisma, dan PostgreSQL.

## Fitur

- **Top Up Game**: Berbagai pilihan game populer dengan harga terbaik
- **Pencarian Game**: Cari game favorit dengan mudah
- **Multi Pembayaran**: QRIS, GoPay, OVO, DANA, Virtual Account
- **Riwayat Pesanan**: Lacak status pesanan secara realtime
- **Dashboard User**: Kelola akun dan riwayat transaksi
- **Dashboard Admin**: CRUD Game, Nominal, Promo, Banner, Pesanan, User
- **Dark Mode**: Tampilan gelap untuk kenyamanan mata
- **Responsive**: Mobile-first, optimal di semua perangkat

## Teknologi

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: Session-based dengan bcryptjs
- **Deployment**: Docker, Docker Compose

## Persyaratan

- Node.js 20+
- PostgreSQL 16+
- Docker & Docker Compose (opsional)

## Instalasi

### 1. Clone dan Install Dependencies

```bash
git clone https://github.com/tasirin1/shoping.git
cd shoping
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env sesuai konfigurasi database kamu
```

### 3. Setup Database

```bash
# Jalankan PostgreSQL (atau gunakan Docker)
docker compose up -d db

# Migrasi database
npx prisma migrate dev --name init

# Seed data awal
npx prisma db seed
```

### 4. Jalankan Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### 5. Build Production

```bash
npm run build
npm start
```

## Docker Deployment

```bash
docker compose up -d --build
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

## Akun Default (Seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shoping.com | admin123 |
| User | user@demo.com | user123 |

## Struktur Proyek

```
shoping/
├── prisma/                  # Prisma schema & seed
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router pages & API
│   │   ├── (auth)/          # Login & Register
│   │   ├── api/             # Backend API routes
│   │   ├── checkout/        # Checkout page
│   │   ├── coming-soon/     # Coming soon page
│   │   ├── dashboard/       # User & Admin dashboard
│   │   ├── games/           # Game listing & detail
│   │   └── orders/          # Order history
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── layout/          # Layout components
│   │   ├── home/            # Home page sections
│   │   ├── game/            # Game-related components
│   │   └── dashboard/       # Dashboard components
│   ├── lib/                 # Utility functions & config
│   └── types/               # TypeScript type definitions
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## API Routes

### Public
- `GET /api/games` - Daftar game
- `GET /api/games/[slug]` - Detail game
- `GET /api/payment-methods` - Metode pembayaran
- `GET /api/promos` - Promo aktif
- `POST /api/check-nickname` - Cek nickname (mock)

### Auth
- `POST /api/auth/register` - Registrasi
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Profile user
- `POST /api/auth/logout` - Logout

### Protected
- `GET /api/orders` - Riwayat pesanan
- `POST /api/orders` - Buat pesanan
- `POST /api/payment/checkout` - Inisiasi pembayaran

### Admin
- `GET /api/admin/stats` - Statistik dashboard
- `GET/POST /api/admin/games` - CRUD game
- `GET/POST /api/admin/nominals` - CRUD nominal
- `GET/POST /api/admin/promos` - CRUD promo
- `GET/POST /api/admin/banners` - CRUD banner
- `GET /api/admin/orders` - Daftar pesanan
- `GET /api/users` - Daftar user (admin only)
- `GET /api/admin/audit-logs` - Log aktivitas

### Webhook
- `POST /api/webhook` - Mock webhook pembayaran

## Keamanan

- Password hashing dengan bcryptjs (12 salt rounds)
- Session-based authentication dengan cookie httpOnly
- Input sanitization (XSS protection)
- Input validation lengkap
- Parameterized queries via Prisma (SQL injection protection)
- Role-based access control (USER/ADMIN)
- Rate limiting pada API routes

## Lisensi

MIT
