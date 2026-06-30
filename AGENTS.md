<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Shoping — Project Agents Guide

## Source of Truth

- Jangan membuat asumsi.
- Jangan mengarang file yang tidak ada.
- Jangan mengatakan bug sudah selesai jika belum ada bukti.
- Jika informasi kurang, minta log atau file yang diperlukan.

## Workflow

Workflow yang digunakan adalah:

1. AI memperbaiki kode.
2. User melakukan commit dan push ke GitHub.
3. Koyeb melakukan build dan deploy.
4. User mengirim log Koyeb.
5. AI menganalisis log.
6. AI memperbaiki kode berdasarkan log tersebut.

Jangan menjalankan testing lokal kecuali diminta secara eksplisit.

## Build

Target build adalah Koyeb.

Semua keputusan harus mempertimbangkan environment production Koyeb.

## Debugging

Gunakan log Koyeb sebagai sumber utama debugging.

Jangan mengatakan "kemungkinan berhasil" atau "seharusnya berhasil".

Cari akar penyebab berdasarkan stack trace.

## Coding Rules

- Jangan menggunakan `any` tanpa alasan yang jelas.
- Jangan menggunakan `@ts-ignore` untuk menyembunyikan error.
- Jangan mematikan TypeScript checking.
- Jangan menghapus fitur hanya agar build berhasil.
- Perbaiki penyebab utama, bukan gejalanya.

## Sebelum Menganggap Selesai

Pastikan:

- Tidak ada error build.
- Tidak ada TypeScript error.
- Tidak ada import rusak.
- Tidak ada dependency yang hilang.
- Tidak ada referensi ke file yang sudah dihapus.
- Tidak ada TODO yang memblokir fitur utama.

## Saat Terjadi Build Error

AI harus:

1. Membaca seluruh log.
2. Menentukan akar penyebab.
3. Memperbaiki hanya bagian yang menyebabkan error.
4. Tidak mengubah bagian lain yang masih berfungsi.
5. Menunggu log Koyeb berikutnya.

## Komunikasi

Setiap selesai mengubah kode, berikan ringkasan:

- File yang diubah.
- Alasan perubahan.
- Dampak perubahan.
- Risiko yang mungkin muncul.
- Hal yang perlu diuji setelah deploy.

Jangan pernah mengatakan "selesai" sebelum build Koyeb berhasil.
