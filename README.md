# 🛒 Shoping

**Platform top up game — modern, cepat, dan aman.**

Shoping adalah platform top up game berbasis web yang dibangun dengan Next.js 16, TypeScript, dan Tailwind CSS. Dirancang untuk memberikan pengalaman pembelian game termudah dengan harga terbaik.

---

## ✨ Fitur

### 🎮 Top Up Game
- Pilih dari 20+ game populer
- Lihat harga langsung tanpa klik tambahan
- Pilih nominal diamond/coin sesuai kebutuhan
- Masukkan User ID — nickname checker otomatis
- Checkout satu halaman tanpa ribet

### 💳 Pembayaran
- **QRIS** — GoPay, OVO, DANA, ShopeePay
- **Transfer Bank** — BCA, Mandiri, BRI, BNI
- **Virtual Account**
- Ringkasan pesanan selalu terlihat
- Invoice otomatis
- Countdown pembayaran
- Status berubah otomatis via webhook

### 👤 Dashboard User
- Riwayat pesanan lengkap
- Status pesanan realtime (Pending/Success/Failed/Expired)
- Cari dan filter pesanan

### 🛠️ Dashboard Admin — CMS Lengkap
Admin dapat mengelola seluruh konten website tanpa menyentuh kode:

| Menu | Fungsi |
|------|--------|
| **Dashboard** | Statistik penjualan, grafik, pesanan terbaru |
| **Produk** | CRUD game, upload icon & banner |
| **Kategori** | Kelompokkan game berdasarkan genre |
| **Nominal** | Atur harga, stok, dan paket top up |
| **Pesanan** | Filter, cari, export CSV, ubah status |
| **Promo** | Kode diskon (persen/nominal) |
| **Pembayaran** | Aktifkan/nonaktifkan metode bayar |
| **API Provider** | Kelola koneksi ke penyedia layanan |
| **Banner** | Atur slider halaman depan |
| **User** | Kelola akun, suspend, reset password |
| **Tema** | 20 tema bawaan, editor warna, import/export JSON |
| **Website** | Ubah logo, favicon, SEO, kontak |
| **Log Aktivitas** | Audit trail admin |

### 🎨 Theme Manager
- 20 tema bawaan (Dark, Midnight, AMOLED Black, Ocean Blue, Purple Neon, Emerald, Crimson, Sunset Orange, Sakura Pink, Gold, Cyan Ice, Coffee, Forest, Galaxy, Aurora, Light, Frost, Cyberpunk, Obsidian, Deep Sea)
- Editor warna: Primary, Secondary, Navbar, Sidebar, Card, Text, Status, dan 20+ elemen lainnya
- Typography: font family, font size, heading font
- Style: border radius, shadow, spacing
- Live preview — perubahan terlihat langsung
- Import & export tema (JSON)
- Duplikasi tema
- Persistensi di database

### 🌙 Dark Mode
- Dark mode sebagai default
- Toggle tema gelap/terang
- Semua komponen mendukung dark mode

### 🔒 Keamanan
- Password di-hash dengan bcrypt
- Session HttpOnly + Secure + SameSite=Lax
- Role-Based Access Control (Admin/User)
- Rate limiting login (5x/menit) & register (2 akun/IP/24 jam)
- Proteksi XSS & CSRF
- Validasi input server-side
- Audit log admin
- Upload file dengan UUID + whitelist ekstensi
- Security headers (CSP, HSTS, X-Frame-Options, dll)

### 📱 Responsive
- Mobile-first design
- Optimasi untuk Desktop, Tablet, dan Mobile
- Layout menyesuaikan dari 320px hingga 4K
- Navigasi konsisten di semua ukuran layar

---

## 🧱 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Bahasa** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Ikon** | Lucide React |
| **Database** | JSON File (file-based) |
| **Auth** | Session dengan bcryptjs |
| **Font** | Inter (Google Fonts) |

---

## 📁 Struktur Proyek

```
shoping/
├── database/                 # Database JSON files
│   ├── users.json
│   ├── games.json
│   ├── products.json
│   ├── orders.json
│   ├── settings.json
│   └── ...
├── public/
│   └── uploads/              # File uploads
├── src/
│   ├── app/
│   │   ├── (auth)/           # Login & Register
│   │   ├── api/              # API Routes
│   │   │   ├── admin/        # Admin API (CRUD)
│   │   │   ├── auth/         # Login, Register, Logout, Me
│   │   │   └── ...           # Public API
│   │   ├── dashboard/        # User & Admin Dashboard
│   │   ├── games/            # Game listing & detail
│   │   ├── checkout/         # Checkout page
│   │   ├── orders/           # Order history
│   │   └── coming-soon/      # Coming soon page
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   ├── layout/           # Header, Footer, Providers
│   │   ├── game/             # Game-specific components
│   │   └── home/             # Homepage sections
│   ├── lib/
│   │   ├── database.ts       # Database service (JSON)
│   │   ├── auth.ts           # Authentication service
│   │   ├── theme.ts          # Theme engine
│   │   ├── validate.ts       # Input validation
│   │   ├── rate-limiter.ts   # Rate limiting
│   │   ├── csrf.ts           # CSRF protection
│   │   ├── audit.ts          # Audit logging
│   │   └── utils.ts          # Utility functions
│   └── types/
│       └── index.ts          # TypeScript types
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## 🚀 Panduan Instalasi

### Prasyarat

- Node.js 20+
- npm atau yarn

### Langkah-langkah

```bash
# Clone repository
git clone https://github.com/tasirin1/shoping.git
cd shoping

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Jalankan development
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### Build Production

```bash
npm run build
npm start
```

### Database Migration

```bash
# Sync schema tanpa migration files (untuk development)
npx prisma db push

# Atau buat migration files (untuk production)
npx prisma migrate dev --name init

# Apply migration di production
npx prisma migrate deploy
```

### Docker (Development)

```bash
docker compose up -d --build
```

### Docker (Production)

```bash
docker build -t shoping .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e SESSION_SECRET="your-secret" \
  -e RUN_SEED="true" \
  shoping
```

---

## 🔑 Akun Default

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |
| **User** | `demo` | `demo123` |

---

## 🌐 Deployment

Shoping dapat di-deploy ke berbagai platform:

### Koyeb

1. Push repository ke GitHub
2. Hubungkan ke Koyeb
3. Add PostgreSQL database (Koyeb PostgreSQL add-on)
4. Set environment variables di Koyeb Dashboard:
   - `DATABASE_URL` — dari Koyeb PostgreSQL add-on
   - `SESSION_SECRET` — random string minimal 32 karakter
   - `RUN_SEED` — `true` hanya untuk deploy pertama
5. Build command: `npm ci && npm run build`
6. Run command: `sh start.sh` (menjalankan migration + seed + server)

### Environment Variables

| Variable | Deskripsi | Wajib | Default |
|----------|-----------|-------|---------|
| `DATABASE_URL` | Connection string PostgreSQL | ✅ | - |
| `SESSION_SECRET` | Secret untuk session (ubah di production) | ✅ | - |
| `NEXT_PUBLIC_APP_URL` | URL aplikasi | ❌ | `http://localhost:3000` |
| `NEXT_PUBLIC_CAPTCHA_SITE_KEY` | reCAPTCHA site key (opsional) | ❌ | - |
| `RUN_SEED` | Jalankan seed saat startup (`true`/`false`) | ❌ | `false` |
| `MAX_UPLOAD_SIZE` | Maksimal ukuran upload (bytes) | ❌ | `5242880` |

---

## 📄 Lisensi

Proyek ini bersifat private. Seluruh hak cipta dilindungi.

---

## 📞 Kontak

| Media | Detail |
|-------|--------|
| Email | support@shoping.com |
| WhatsApp | 6281234567890 |
| Telegram | @shoping |

---

*Dokumentasi ini diperbarui secara berkala.*
