# Shoping - Top Up Game Website

Platform top up game modern, elegan, dan cepat. Dibangun dengan Next.js 16, TypeScript, dan Tailwind CSS.

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
- **Backend**: Next.js API Routes, JSON Database
- **Auth**: Session-based dengan bcryptjs
- **Deployment**: Docker, Koyeb

## Persyaratan

- Node.js 20+
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
# Edit SESSION_SECRET dengan string acak yang aman
```

### 3. Jalankan Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### 4. Build Production

```bash
npm run build
npm start
```

## Docker Deployment

```bash
docker compose up -d --build
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

## Deployment ke Koyeb

1. Push repository ke GitHub
2. Set environment variables di Koyeb:
   - `NEXT_PUBLIC_APP_URL`: URL aplikasi Koyeb
   - `SESSION_SECRET`: String acak yang aman
3. Deploy dari GitHub via Koyeb dashboard
4. Set `Build Command`:
   ```
   npm ci && npm run build
   ```
5. Set `Run Command`:
   ```
   npm start
   ```

## Login Default

**Admin:**
- Email: admin@shoping.com
- Password: admin123

**User:**
- Email: demo@shoping.com
- Password: demo123

## Struktur Database

Aplikasi menggunakan file JSON sebagai database lokal yang tersimpan di folder `/database`:

- `users.json` - Data user
- `games.json` - Data game
- `products.json` - Data nominal top up
- `orders.json` - Data pesanan
- `providers.json` - Data API provider
- `payments.json` - Data metode pembayaran
- `banners.json` - Data banner
- `promos.json` - Data promo
- `settings.json` - Pengaturan website
- `logs.json` - Log aktivitas admin
- `categories.json` - Kategori game
- `sessions.json` - Sesi login

Database Service (`src/lib/database.ts`) sudah diabstraksi sehingga mudah diganti ke Prisma/PostgreSQL tanpa mengubah logika bisnis.
