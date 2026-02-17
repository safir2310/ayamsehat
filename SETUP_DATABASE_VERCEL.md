# 🗄️ Setup Database Vercel & Seed Data

## Status: 🔄 Database belum dibuat di Vercel

---

## ✅ Yang Sudah Dilakukan:
- ✅ Vercel CLI sudah terinstall
- ✅ Login ke Vercel berhasil
- ✅ Project sudah linked ke Vercel
- ✅ Environment variables sudah di-pull

---

## ⚠️ Masalah: Database PostgreSQL belum dibuat

Saat ini environment variable `DATABASE_URL` belum ada di project Vercel. Anda perlu membuat database terlebih dahulu.

---

## 🔧 Langkah-langkah Membuat Database di Vercel:

### Langkah 1: Buka Vercel Dashboard
1. Login ke: https://vercel.com/dashboard
2. Cari project `my-project` (atau `ayamsehat` jika sudah direname)
3. Klik pada project tersebut

### Langkah 2: Buat Database PostgreSQL
1. Di dalam project, klik tab **"Storage"**
2. Klik tombol **"Create Database"**
3. Pilih **"Postgres"**
4. Isi form:
   - **Database Name**: `ayamsehat-db` (atau nama lain sesuai keinginan)
   - **Region**: Pilih "Singapore" (paling dekat dengan Indonesia untuk performa terbaik)
   - **Plan**: Pilih "Free" (Gratis - cukup untuk development)
5. Klik **"Create"**

### Langkah 3: Koneksikan Database ke Project
1. Setelah database berhasil dibuat, Vercel akan menampilkan konfirmasi
2. Klik tombol **"Connect Project"**
3. Pilih project `my-project` (atau `ayamsehat`)
4. Vercel akan otomatis:
   - Menambahkan environment variable `DATABASE_URL` ke project
   - Mengkoneksikan database dengan project
5. Klik **"Continue"**

### Langkah 4: Verifikasi Environment Variable
1. Di Vercel Dashboard, buka **Settings** → **Environment Variables**
2. Pastikan ada variable `DATABASE_URL`
3. Formatnya akan seperti:
   ```
   postgresql://user:password@host:port/database?sslmode=require
   ```

---

## 📦 Langkah Selanjutnya: Seed Data

Setelah database berhasil dibuat dan dikoneksikan, jalankan perintah berikut untuk seeding data awal:

### Opsi 1: Menggunakan Vercel CLI (Recommended)

```bash
# 1. Pull environment variable DATABASE_URL terbaru
./node_modules/.bin/vercel env pull .env.local --environment=production

# 2. Generate Prisma Client
bun run db:generate

# 3. Push schema ke database (buat tabel)
bun run db:push

# 4. Seed data awal (admin, produk, redeem codes)
bun run db:seed
```

### Opsi 2: Langsung di Production (Setelah Deploy)

```bash
# Deploy terlebih dahulu
./node_modules/.bin/vercel --prod

# Kemudian jalankan seed di production
./node_modules/.bin/vercel env pull .env.production --environment=production
bun run db:seed
```

---

## 🎯 Data yang Akan Dibuat oleh Seed Script:

### 1. Profile Toko
- Name: AYAM GEPREK SAMBAL IJO
- Slogan: Pedasnya Bikin Nagih 🔥🔥
- Address: Jl. Medan - Banda Aceh, Simpang Camat, Gampong Tijue, Kec. Pidie, Kab. Pidie, 24151
- Phone: 085260812758
- Point Value: 100 (1 point = Rp 100)
- Min Balance: 1000

### 2. Admin User
- Username: `admin`
- Email: `admin@ayamgeprek.com`
- Password: `admin123`
- Phone: 085260812758

### 3. 12 Produk (Makanan & Minuman)
- Ayam Geprek Sambal Ijo - Rp 15.000 (Promo)
- Ayam Geprek Sambal Merah - Rp 15.000 (Promo)
- Ayam Geprek Telur - Rp 18.000 (New)
- Nasi Putih - Rp 5.000
- Es Teh Manis - Rp 5.000
- Es Jeruk - Rp 6.000 (Promo)
- Ayam Geprek Mozarella - Rp 22.000 (Promo, New)
- Es Campur - Rp 10.000
- Paket Hemat - Rp 20.000 (Promo)
- Es Kopi Susu - Rp 12.000 (New)
- Ayam Geprek Pedas Gila - Rp 17.000 (Promo, New)
- Jus Alpukat - Rp 12.000

### 4. 4 Redeem Codes
- `SELAMATDATANG` = 500 points
- `PROMO2024` = 1000 points
- `SPESIAL500` = 500 points
- `CASHBACK250` = 250 points

---

## 🔍 Troubleshooting:

### Error: "No Environment Variables found"
**Solusi**: Database belum dikoneksikan ke project. Ikuti Langkah 1-3 di atas.

### Error: "database connection failed"
**Solusi**:
- Pastikan DATABASE_URL ada di environment variables
- Cek format URL harus: `postgresql://user:password@host:port/database?sslmode=require`
- Pastikan database sudah aktif di Vercel Dashboard

### Error: "relation does not exist"
**Solusi**: Jalankan `bun run db:push` terlebih dahulu untuk membuat tabel-tabel database

### Error: "prisma generate failed"
**Solusi**:
- Pastikan DATABASE_URL sudah di-pull dari Vercel
- Jalankan `bun run db:generate` lagi

---

## 📋 Quick Commands Reference:

```bash
# Pull environment variables
./node_modules/.bin/vercel env pull .env.local --environment=production

# Generate Prisma Client
bun run db:generate

# Push schema ke database (buat tabel)
bun run db:push

# Seed data awal
bun run db:seed

# Deploy ke production
./node_modules/.bin/vercel --prod
```

---

## ✨ Setelah Selesai:

1. **Login ke Admin Dashboard**:
   - URL: `https://your-app.vercel.app/dashboard/admin`
   - Username: `admin`
   - Password: `admin123`

2. **Test Aplikasi**:
   - Register user baru
   - Coba redeem code: `SELAMATDATANG`
   - Tambah produk ke keranjang
   - Checkout

3. **Monitoring Database**:
   - Buka Vercel Dashboard → Storage → Postgres
   - Cek tabel dan data yang sudah dibuat
   - Monitor penggunaan database

---

## 📝 Catatan Penting:

- Database PostgreSQL di Vercel menggunakan SSL connection (`sslmode=require`)
- Free tier: 512MB storage, 60 hours compute/month
- Database akan otomatis backup oleh Vercel
- Pastikan region diset ke "Singapore" untuk performa terbaik di Indonesia

---

**🚀 Jika sudah selesai membuat database di Vercel, beritahu saya untuk lanjut ke proses seeding data!**
