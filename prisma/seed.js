const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  try {
    // Create profile toko
    const profileToko = await prisma.profileToko.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        name: 'AYAM GEPREK SAMBAL IJO',
        slogan: 'Pedasnya Bikin Nagih 🔥🔥',
        address: 'Jl. Medan - Banda Aceh, Simpang Camat, Gampong Tijue, Kec. Pidie, Kab. Pidie, 24151',
        phone: '085260812758',
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        pointValue: 100,
        minBalance: 1000,
      },
    })
    console.log('✅ Profile toko created:', profileToko.name)

    // Create admin
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.admin.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@ayamgeprek.com',
        password: adminPassword,
        phone: '085260812758',
        birthDate: new Date('1990-01-01'),
      },
    })
    console.log('✅ Admin created:', admin.username)

    // Create sample products
    const products = [
      {
        name: 'Ayam Geprek Sambal Ijo',
        description: 'Ayam goreng crispy dengan sambal ijo pedas autentik',
        price: 15000,
        category: 'makanan',
        image: '',
        isPromo: true,
        discount: 10,
        isNew: true,
      },
      {
        name: 'Ayam Geprek Sambal Merah',
        description: 'Ayam goreng crispy dengan sambal merah pedas mantap',
        price: 15000,
        category: 'makanan',
        image: '',
        isPromo: true,
        discount: 5,
        isNew: false,
      },
      {
        name: 'Ayam Geprek Telur',
        description: 'Ayam geprek dengan telur dadar goreng',
        price: 18000,
        category: 'makanan',
        image: '',
        isPromo: false,
        discount: 0,
        isNew: true,
      },
      {
        name: 'Nasi Putih',
        description: 'Nasi putih pulen enak',
        price: 5000,
        category: 'makanan',
        image: '',
        isPromo: false,
        discount: 0,
        isNew: false,
      },
      {
        name: 'Es Teh Manis',
        description: 'Es teh manis segar',
        price: 5000,
        category: 'minuman',
        image: '',
        isPromo: false,
        discount: 0,
        isNew: false,
      },
      {
        name: 'Es Jeruk',
        description: 'Es jeruk peras segar',
        price: 6000,
        category: 'minuman',
        image: '',
        isPromo: true,
        discount: 15,
        isNew: false,
      },
      {
        name: 'Ayam Geprek Mozarella',
        description: 'Ayam geprek dengan keju mozarella lumer',
        price: 22000,
        category: 'makanan',
        image: '',
        isPromo: true,
        discount: 20,
        isNew: true,
      },
      {
        name: 'Es Campur',
        description: 'Es campur segar dengan buah-buahan',
        price: 10000,
        category: 'minuman',
        image: '',
        isPromo: false,
        discount: 0,
        isNew: false,
      },
      {
        name: 'Paket Hemat',
        description: 'Ayam geprek + nasi + es teh',
        price: 20000,
        category: 'makanan',
        image: '',
        isPromo: true,
        discount: 25,
        isNew: false,
      },
      {
        name: 'Es Kopi Susu',
        description: 'Es kopi susu gula aren',
        price: 12000,
        category: 'minuman',
        image: '',
        isPromo: false,
        discount: 0,
        isNew: true,
      },
      {
        name: 'Ayam Geprek Pedas Gila',
        description: 'Ayam geprek dengan sambal pedas level dewa',
        price: 17000,
        category: 'makanan',
        image: '',
        isPromo: true,
        discount: 10,
        isNew: true,
      },
      {
        name: 'Jus Alpukat',
        description: 'Jus alpukat segar dengan susu coklat',
        price: 12000,
        category: 'minuman',
        image: '',
        isPromo: false,
        discount: 0,
        isNew: false,
      },
    ]

    for (const product of products) {
      await prisma.produk.create({
        data: product,
      })
    }
    console.log(`✅ Products created: ${products.length} items`)

    // Create sample redeem codes
    const redeemCodes = [
      { code: 'SELAMATDATANG', points: 500, isActive: true, expiredAt: null },
      { code: 'PROMO2024', points: 1000, isActive: true, expiredAt: null },
      { code: 'SPESIAL500', points: 500, isActive: true, expiredAt: null },
      { code: 'CASHBACK250', points: 250, isActive: true, expiredAt: null },
    ]

    for (const redeemCode of redeemCodes) {
      await prisma.redeemCode.create({
        data: redeemCode,
      })
    }
    console.log(`✅ Redeem codes created: ${redeemCodes.length} codes`)

    console.log('🎉 Database seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
