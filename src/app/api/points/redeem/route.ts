import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('user')

    if (!userCookie) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(userCookie.value)
    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ message: 'Product ID diperlukan' }, { status: 400 })
    }

    // Get product point details
    const product = await db.produkPoint.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ message: 'Produk tidak ditemukan' }, { status: 404 })
    }

    // Check user balance
    const wallet = await db.walletSaldo.findUnique({
      where: { userId: user.id },
    })

    if (!wallet || wallet.balance < product.points) {
      return NextResponse.json(
        { message: 'Saldo tidak cukup untuk menukar produk ini' },
        { status: 400 }
      )
    }

    // Start transaction
    await db.$transaction(async (tx) => {
      // Deduct balance
      await tx.walletSaldo.update({
        where: { userId: user.id },
        data: { balance: wallet.balance - product.points },
      })

      // Add wallet history
      await tx.walletHistory.create({
        data: {
          userId: user.id,
          type: 'debit',
          amount: product.points,
          description: `Tukar produk: ${product.name}`,
        },
      })
    })

    return NextResponse.json({
      message: 'Berhasil menukar produk!',
      productName: product.name,
      pointsUsed: product.points,
    })
  } catch (error) {
    console.error('Error redeeming product:', error)
    return NextResponse.json({ message: 'Gagal menukar produk' }, { status: 500 })
  }
}
