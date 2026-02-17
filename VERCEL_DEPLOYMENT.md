# 🚀 Panduan Deploy ke Vercel dengan Database PostgreSQL

## Langkah 1: Set Up Vercel Postgres Database

### 1.1 Buat Project di Vercel
1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik "Add New" → "Project"
3. Import repository `ayamsehat` dari GitHub
4. Pilih preset "Next.js"

### 1.2 Buat Database PostgreSQL
1. Di Vercel Dashboard, klik "Storage" → "Create Database"
2. Pilih "Postgres"
3. Beri nama database (misal: `ayamsehat-db`)
4. Pilih region "Singapore" (terdekat dengan Indonesia)
5. Klik "Create"

### 1.3 Koneksikan Database ke Project
1. Setelah database dibuat, klik "Connect Project"
2. Pilih project `ayamsehat` yang sudah dibuat sebelumnya
3. Vercel akan otomatis menambahkan environment variable `DATABASE_URL`

## Langkah 2: Update Konfigurasi

### 2.1 Verifikasi Environment Variables
Di Vercel Dashboard → Settings → Environment Variables:
- Pastikan ada `DATABASE_URL` (otomatis ditambahkan dari Vercel Postgres)

### 2.2 Update Build Command
Di Vercel Dashboard → Settings → Build & Development:
- Build Command: `prisma generate && next build`
- Install Command: `bun install` (atau `npm install`)
- Output Directory: `.next`

## Langkah 3: Deploy ke Vercel

### 3.1 Deploy Pertama
1. Di Vercel Dashboard, klik "Deploy" pada project
2. Vercel akan:
   - Install dependencies
   - Generate Prisma Client
   - Build Next.js application
   - Deploy ke Vercel's Edge Network

### 3.2 Run Database Migrations
Setelah deploy berhasil, jalankan migration:

**Opsi A: Melalui Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Link ke project
vercel link

# Generate Prisma Client
prisma generate

# Push schema ke database (untuk development)
prisma db push

# Atau gunakan migration untuk production
prisma migrate deploy
```

**Opsi B: Melalui Vercel Dashboard**
1. Settings → Functions → Cron Jobs
2. Buat cron job untuk menjalankan `prisma migrate deploy`

**Opsi C: Manual Migration**
1. Buka Vercel Postgres dari Dashboard
2. Buka "Console"
3. Jalankan perintah SQL dari `prisma/migrations` folder

## Langkah 4: Seed Data (Data Awal)

### 4.1 Buat Seed Script untuk Vercel
Buat file `prisma/seed.js` (JavaScript untuk kompatibilitas):

```javascript
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Hash password admin
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Create Admin
  await prisma.admin.upsert({
    where: { email: 'admin@ayamgeprek.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@ayamgeprek.com',
      password: hashedPassword,
      phone: '085260812758',
    },
  })

  // Create Profile Toko
  await prisma.profileToko.upsert({
    where: { id: 'profile-1' },
    update: {},
    create: {
      id: 'profile-1',
      name: 'AYAM GEPREK SAMBAL IJO',
      slogan: 'Pedasnya Bikin Nagih 🔥🔥',
      address: 'Jl. Contoh No. 123, Indonesia',
      phone: '085260812758',
      instagram: 'https://instagram.com/ayamgeprek',
      facebook: 'https://facebook.com/ayamgeprek',
      pointValue: 100,
      minBalance: 1000,
    },
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 4.2 Jalankan Seed Script
**Lokal (jika connected ke Vercel Postgres):**
```bash
bun prisma/seed.js
```

**Production:**
1. Deploy seed script sebagai Vercel Function
2. Atau jalankan melalui Vercel CLI di production environment:
```bash
vercel env pull .env.production
bun prisma/seed.js
```

## Langkah 5: Verifikasi Deployment

### 5.1 Cek Aplikasi
1. Buka URL dari Vercel (misal: `https://ayamsehat.vercel.app`)
2. Test semua fitur:
   - Login/Register
   - Lihat produk
   - Tambah ke keranjang
   - Checkout
   - Admin dashboard

### 5.2 Cek Database
1. Buka Vercel Dashboard → Storage → Postgres
2. Klik "Console"
3. Jalankan query untuk verifikasi:
```sql
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "Produk";
SELECT COUNT(*) FROM "RedeemCode";
```

## Troubleshooting

### Error: Database Connection Failed
**Solusi:**
- Pastikan `DATABASE_URL` ada di environment variables
- Pastikan URL formatnya benar: `postgresql://user:password@host:port/database?sslmode=require`

### Error: Prisma Client Not Generated
**Solusi:**
- Build command harus: `prisma generate && next build`
- Pastikan `postinstall: prisma generate` di package.json

### Error: Migration Failed
**Solusi:**
- Use `prisma db push` untuk development (faster, no migration files)
- Use `prisma migrate deploy` untuk production (uses migration files)

### Error: Seed Data Not Loading
**Solusi:**
- Buat script seed dalam JavaScript (bukan TypeScript)
- Pastikan semua dependencies terinstall

## Konfigurasi Tambahan

### Environment Variables
Tambahkan di Vercel Dashboard:

```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
NODE_ENV=production
```

### Custom Domain
1. Settings → Domains
2. Tambahkan custom domain (misal: `ayamsehat.com`)
3. Follow instruksi DNS dari Vercel

### Automatic Deployments
- Setiap push ke branch `main` atau `master` akan otomatis trigger deployment
- Untuk branch lain, gunakan "Preview Deployments"

## Best Practices

1. **Gunakan Vercel Postgres**:
   - Free tier: 512MB storage, 60 hours compute/month
   - Production-ready dengan SSL & backup

2. **Database Connection Pooling**:
   - Vercel Postgres otomatis menggunakan connection pooling
   - Tidak perlu konfigurasi tambahan

3. **Migration Strategy**:
   - Development: `prisma db push`
   - Production: `prisma migrate deploy`

4. **Monitoring**:
   - Gunakan Vercel Analytics untuk monitoring
   - Monitor database usage di Vercel Postgres dashboard

## Kontak Support

- Vercel Documentation: https://vercel.com/docs
- Prisma + Vercel: https://vercel.com/docs/storage/vercel-postgres
- PostgreSQL: https://www.postgresql.org/docs/

---

## Quick Start Commands

```bash
# Local development dengan Vercel Postgres
vercel link
vercel env pull .env
prisma generate
prisma db push
bun run dev

# Production deployment
git push origin main  # Otomatis deploy ke Vercel

# Database operations
prisma studio           # Buka database GUI
prisma migrate dev      # Buat migration baru
prisma migrate deploy   # Terapkan migration ke production
```

Selamat deploy! 🎉
