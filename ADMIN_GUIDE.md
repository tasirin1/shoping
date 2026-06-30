# 📘 Panduan Administrasi Shoping

**Panduan lengkap pengelolaan website top up game Shoping untuk administrator.**

---

## 📋 Daftar Isi

1. [Akses Dashboard Admin](#1-akses-dashboard-admin)
2. [Dashboard Utama](#2-dashboard-utama)
3. [Produk & Game](#3-produk--game)
4. [Nominal Top Up](#4-nominal-top-up)
5. [Kategori](#5-kategori)
6. [Pesanan](#6-pesanan)
7. [Promo](#7-promo)
8. [Pembayaran](#8-pembayaran)
9. [API Provider](#9-api-provider)
10. [Banner](#10-banner)
11. [User Management](#11-user-management)
12. [Theme Manager](#12-theme-manager)
13. [Pengaturan Website](#13-pengaturan-website)
14. [Log Aktivitas](#14-log-aktivitas)
15. [FAQ Admin](#15-faq-admin)

---

## 1. Akses Dashboard Admin

### Login Admin

1. Buka halaman `/login`
2. Masukkan **Username** dan **Password** admin
3. Setelah login, sistem akan otomatis mengarahkan ke Dashboard Admin

**Login default:**

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Administator |

> **Penting:** Segera ganti password default setelah pertama kali login melalui menu **User** di dashboard admin.

### Struktur Menu

```
Dashboard Admin
├── 📊 Dashboard
├── 📦 Produk
├── 🏷️ Kategori
├── 🎮 Nominal
├── 🛒 Pesanan
├── 🎟️ Promo
├── 💳 Pembayaran
├── 🖼️ Banner
├── ⚡ API Provider
├── 👥 User
├── 🎨 Tema
├── ⚙️ Website
└── 📝 Log Aktivitas
```

---

## 2. Dashboard Utama

Halaman pertama setelah login admin menampilkan ringkasan bisnis:

**Kartu Statistik:**
- **Total Pendapatan** — seluruh pendapatan dari pesanan sukses
- **Total Pesanan** — jumlah semua pesanan
- **Total User** — jumlah pengguna terdaftar
- **Menunggu** — pesanan dengan status PENDING

**Tabel:**
- **Pesanan Terbaru** — 8 pesanan terakhir, menampilkan invoice, game, user, total, status, tanggal
- **Game Terpopuler** — peringkat game dengan penjualan terbanyak

> Statistik diperbarui secara realtime setiap kali halaman dimuat.

---

## 3. Produk & Game

Menu **Produk** digunakan untuk mengelola daftar game yang tersedia untuk top up.

### Menambahkan Game Baru

1. Klik tombol **+ Tambah** di halaman Produk
2. Isi form:
   - **Nama Game** — nama lengkap game (contoh: Mobile Legends)
   - **Slug** — identifier untuk URL (otomatis diisi, contoh: `mobile-legends`)
   - **Deskripsi** — deskripsi singkat game
   - **Kategori** — pilih kategori yang sudah ada
   - **Icon Game** — upload logo/icon game (format: PNG, JPG, SVG, WEBP; maks: 5MB)
   - **Banner** — upload gambar banner game
   - **Provider** — pilih API provider (jika ada)
   - **Populer** — centang jika game ingin ditampilkan di section populer
   - **Urutan** — nomor urut tampilan (semakin kecil semakin atas)
   - **Status** — Aktif/Nonaktif
3. Klik **Simpan**

### Mengedit Game

1. Klik ikon ✏️ (Edit) pada game yang ingin diubah
2. Ubah data yang diperlukan
3. Klik **Simpan**

### Menghapus Game

1. Klik ikon 🗑️ (Hapus) pada game yang ingin dihapus
2. Konfirmasi penghapusan

> Penghapusan game akan menghapus semua nominal top up yang terkait dengan game tersebut.

---

## 4. Nominal Top Up

Menu **Nominal** digunakan untuk mengelola paket top up (jumlah diamond/coin) untuk setiap game.

### Menambahkan Nominal

1. Pilih menu **Nominal**
2. Klik **+ Tambah Nominal**
3. Isi form:
   - **Game** — pilih game dari dropdown
   - **Nama Nominal** — contoh: "100 Diamonds", "Weekly Pass"
   - **Jumlah** — jumlah diamond/coin (contoh: 100)
   - **Harga Jual** — harga yang ditampilkan ke pembeli
   - **Harga Modal** — harga modal/reseller (untuk hitung untung)
   - **Harga Asli** — harga normal sebelum diskon (opsional)
   - **Stok** — jumlah stok (`-1` = tidak terbatas)
   - **Aktif** — centang jika aktif
4. Klik **Simpan**

### Kolom di Tabel Nominal

| Kolom | Keterangan |
|-------|------------|
| Game | Nama game pemilik nominal |
| Nama | Nama paket nominal |
| Jumlah | Jumlah diamond/coin |
| Harga | Harga jual ke pembeli |
| Untung | Selisih harga jual - harga modal |
| Stok | Stok tersedia (∞ = unlimited) |
| Status | Aktif / Nonaktif |

---

## 5. Kategori

Menu **Kategori** digunakan untuk mengelompokkan game berdasarkan genre.

### Kategori Tersedia

| Kategori | Slug |
|----------|------|
| MOBA | `moba` |
| Battle Royale | `battle-royale` |
| FPS | `fps` |
| RPG | `rpg` |

### Mengelola Kategori

- **Tambah** — klik **+ Tambah**, isi nama dan slug, atur urutan
- **Edit** — klik ✏️, ubah data yang diperlukan
- **Hapus** — klik 🗑️ (kategori tidak bisa dihapus jika masih memiliki game terkait)

---

## 6. Pesanan

Menu **Pesanan** menampilkan semua transaksi top up yang dilakukan pengguna.

### Status Pesanan

| Status | Warna | Keterangan |
|--------|-------|------------|
| PENDING | 🟡 Kuning | Menunggu pembayaran |
| SUCCESS | 🟢 Hijau | Pembayaran berhasil, top up terproses |
| FAILED | 🔴 Merah | Pembayaran gagal |
| EXPIRED | ⚪ Abu | Melewati batas waktu pembayaran |

### Fitur

- **Filter Status** — filter pesanan berdasarkan status
- **Pencarian** — cari berdasarkan invoice, username, atau game
- **Sorting** — klik header kolom untuk mengurutkan
- **Export CSV** — download data pesanan

### Mengubah Status Pesanan

Untuk mengubah status pesanan secara manual (jika diperlukan):
1. Klik ikon ✏️ pada pesanan
2. Pilih status baru
3. Klik **Simpan**

---

## 7. Promo

Menu **Promo** digunakan untuk membuat kode diskon atau voucher.

### Membuat Promo Baru

1. Klik **+ Tambah Promo**
2. Isi form:
   - **Kode Promo** — kode unik (contoh: `HEMAT10`)
   - **Nama** — nama promo (contoh: "Diskon 10%")
   - **Deskripsi** — keterangan tambahan
   - **Tipe Diskon** — `PERCENTAGE` (persen) atau `NOMINAL` (rupiah)
   - **Diskon** — nilai diskon (contoh: 10 untuk 10%, atau 5000 untuk Rp5.000)
   - **Min Pembelian** — minimal belanja (opsional)
   - **Maks Diskon** — maksimal diskon untuk tipe persen (opsional)
   - **Maks Penggunaan** — batas pemakaian (opsional, kosongkan = tidak terbatas)
   - **Status** — Aktif/Nonaktif
3. Klik **Simpan**

---

## 8. Pembayaran

Menu **Pembayaran** digunakan untuk mengelola metode pembayaran yang tersedia.

### Metode Pembayaran

| Metode | Tipe | Keterangan |
|--------|------|------------|
| QRIS | QRIS | Semua E-Wallet (GoPay, OVO, DANA, ShopeePay) |
| GoPay | EWALLET | GoPay |
| OVO | EWALLET | OVO |
| DANA | EWALLET | DANA |
| ShopeePay | EWALLET | ShopeePay |
| Transfer BCA | VIRTUAL_ACCOUNT | Bank BCA |
| Transfer Mandiri | VIRTUAL_ACCOUNT | Bank Mandiri |
| Transfer BRI | VIRTUAL_ACCOUNT | Bank BRI |
| Transfer BNI | VIRTUAL_ACCOUNT | Bank BNI |

### Mengelola Pembayaran

- **Aktifkan/Nonaktifkan** — centang/centang pada kolom Status
- **Edit** — ubah nama, nomor rekening, atau atas nama
- **Urutan** — atur posisi tampilan

---

## 9. API Provider

Menu **API Provider** digunakan untuk mengelola koneksi ke penyedia layanan top up.

### Menambahkan Provider

1. Klik **+ Tambah Provider**
2. Isi form:
   - **Nama Provider** — nama penyedia layanan
   - **Base URL** — endpoint API provider
   - **API Key** — kunci autentikasi
   - **API Secret** — secret key
   - **Merchant ID** — ID merchant (jika ada)
   - **Signature** — signature/key tambahan
   - **Mode** — `Sandbox` (pengujian) / `Production`
   - **Status** — Aktif/Nonaktif
3. Klik **Simpan**

> Data API Key dan Secret disimpan dalam database. Pastikan environment aman.

---

## 10. Banner

Menu **Banner** digunakan untuk mengelola banner yang tampil di halaman depan website.

### Menambahkan Banner

1. Klik **+ Tambah Banner**
2. Isi form:
   - **Judul** — teks utama banner
   - **Subtitle** — teks pendukung
   - **Gambar** — upload gambar banner (ukuran ideal: 1200×400px)
   - **Link** — URL tujuan saat banner diklik (opsional)
   - **Posisi** — urutan tampilan
   - **Status** — Aktif/Nonaktif
3. Klik **Simpan**

---

## 11. User Management

Menu **User** digunakan untuk mengelola seluruh akun pengguna.

### Fitur

| Fitur | Keterangan |
|-------|------------|
| 📋 Daftar User | Tabel semua pengguna terdaftar |
| 🔍 Cari | Pencarian berdasarkan username atau email |
| ✏️ Edit | Ubah data pengguna (nama, role, status) |
| 🔒 Suspend | Nonaktifkan akun pengguna |
| 🔄 Reset Password | Ubah password pengguna |
| 🗑️ Hapus | Hapus akun pengguna |

### Role User

| Role | Akses |
|------|-------|
| **USER** | Dapat melakukan top up, melihat riwayat, mengakses dashboard user |
| **ADMIN** | Akses penuh ke seluruh menu admin |

> Hanya user dengan role ADMIN yang dapat mengakses halaman `/dashboard/admin`.

---

## 12. Theme Manager

Menu **Tema** digunakan untuk mengatur tampilan visual website secara penuh tanpa perlu mengubah kode.

### Tema Bawaan (20 Tema)

🌑 Dark (Default) · 🌙 Midnight · ⚫ AMOLED Black · 🔵 Ocean Blue · 🟣 Purple Neon
🟢 Emerald · 🔴 Crimson · 🟠 Sunset Orange · 🌸 Sakura Pink · 🟡 Gold
🩵 Cyan Ice · 🟤 Coffee · 🌿 Forest · 🌌 Galaxy · 🌈 Aurora
🤍 Light · 🧊 Frost · 💜 Cyberpunk · 🖤 Obsidian · 🌊 Deep Sea

### Mengganti Tema

1. Buka menu **Tema** di sidebar
2. Klik tombol **Aktifkan** pada tema yang diinginkan
3. Tema akan langsung diterapkan tanpa perlu refresh halaman

### Membuat & Mengedit Tema

**Membuat tema baru:**
1. Klik **+ Tema Baru**
2. Masukkan nama tema dan icon
3. Tema akan dibuat berdasarkan tema Dark default
4. Klik ikon 🎨 untuk membuka editor

**Mengedit tema:**
1. Klik ikon 🎨 pada tema kustom
2. Di editor, Anda bisa mengubah:
   - **Warna** — Primary, Secondary, Accent, Surface, Navbar, Sidebar, Footer, Background, Card, Button, Input, Border, Text, Link, Success, Warning, Error, Info
   - **Typography** — Font Family, Heading Font, Font Size
   - **Style** — Border Radius, Shadow, Spacing
3. Centang **Preview** untuk melihat perubahan secara langsung
4. Klik **Simpan** jika sudah puas

**Fitur lainnya:**
- **Duplikasi** — menggandakan tema yang sudah ada
- **Import** — upload file JSON tema
- **Ekspor** — download tema sebagai file JSON
- **Reset** — kembali ke tema Dark default

---

## 13. Pengaturan Website

Menu **Website** digunakan untuk mengatur informasi dan SEO website.

### Pengaturan Tersedia

| Pengaturan | Keterangan |
|------------|------------|
| Nama Website | Nama yang tampil di browser dan navbar |
| Deskripsi | Deskripsi singkat website |
| URL Logo | Link logo (upload melalui Tema) |
| URL Favicon | Link favicon (upload melalui Tema) |
| Warna Utama | Warna primary website |
| Footer Text | Teks di bagian footer |
| Email | Email kontak |
| WhatsApp | Nomor WhatsApp |
| Telegram | Akun Telegram |
| Discord | Server Discord |
| Meta Title | Judul untuk SEO |
| Meta Description | Deskripsi untuk SEO |

---

## 14. Log Aktivitas

Menu **Log Aktivitas** mencatat semua aktivitas penting yang dilakukan oleh admin.

### Yang Tercatat

- ✅ Login berhasil & gagal
- ✅ Logout
- ✅ Registrasi akun baru
- ✅ CRUD Game (Tambah, Edit, Hapus)
- ✅ CRUD Nominal
- ✅ CRUD Kategori
- ✅ CRUD Banner
- ✅ CRUD Promo
- ✅ Perubahan pengaturan website
- ✅ Perubahan tema
- ✅ Upload file
- ✅ Manajemen user

### Informasi di Log

| Kolom | Keterangan |
|-------|------------|
| Waktu | Tanggal dan jam kejadian |
| User | Admin yang melakukan aksi |
| Aksi | Jenis aktivitas |
| Entity | Objek yang diubah |
| Detail | Keterangan tambahan |
| IP Address | Alamat IP pengguna |

---

## 15. FAQ Admin

### ❓ Bagaimana cara menambahkan game baru?
Buka menu **Produk** → klik **+ Tambah** → isi data game → **Simpan**.

### ❓ Bagaimana cara menambahkan nominal top up?
Buka menu **Nominal** → klik **+ Tambah Nominal** → pilih game → isi nominal → **Simpan**.

### ❓ Bagaimana cara melihat pesanan masuk?
Buka menu **Pesanan**. Semua pesanan akan muncul secara otomatis.

### ❓ Bagaimana cara mengganti tema website?
Buka menu **Tema** → klik **Aktifkan** pada tema yang diinginkan.

### ❓ Bagaimana cara mengubah logo website?
Buka menu **Tema** → edit tema aktif → upload logo baru melalui uploader.

### ❓ Apa yang harus dilakukan jika ada pengguna yang melanggar?
Buka menu **User** → cari pengguna tersebut → klik **Edit** → centang **Suspend** → **Simpan**.

### ❓ Bagaimana cara mereset password user?
Buka menu **User** → klik **Edit** → masukkan password baru → **Simpan**.

### ❓ Bisakah saya mengekspor data pesanan?
Ya. Di halaman **Pesanan**, klik ikon 📋 (Export CSV) untuk mendownload data dalam format CSV.

### ❓ Apa perbedaan Sandbox dan Production pada API Provider?
**Sandbox** digunakan untuk pengujian, tidak memproses transaksi sungguhan.
**Production** digunakan untuk transaksi nyata.

### ❓ Bagaimana jika lupa password admin?
Hubungi pengembang untuk mereset password melalui database, atau gunakan fitur reset di menu **User** oleh admin lain.

---

## 🔐 Keamanan

### Rekomendasi

1. **Ganti password default** segera setelah login pertama
2. Gunakan password yang kuat (min 8 karakter, kombinasi huruf + angka)
3. Jangan bagikan kredensial admin ke pihak lain
4. Logout setelah selesai menggunakan dashboard admin
5. Pantau **Log Aktivitas** secara berkala
6. Jangan menggunakan API Key production untuk pengujian

### Proteksi yang Aktif

- ✅ Password di-hash dengan bcrypt
- ✅ Session HttpOnly + Secure
- ✅ Rate limiting login (5x/menit)
- ✅ Batas registrasi per IP (2 akun/24 jam)
- ✅ Proteksi XSS & CSRF
- ✅ Validasi input server-side
- ✅ Audit log admin
- ✅ Upload file terproteksi (UUID, whitelist ekstensi)

---

## 🆘 Kontak & Dukungan

| Media | Kontak |
|-------|--------|
| Email | support@shoping.com |
| WhatsApp | 6281234567890 |
| Telegram | @shoping |

---

*Panduan ini diperbarui secara berkala. Untuk saran dan masukan, hubungi tim pengembang.*

**© 2026 Shoping. All rights reserved.**
