import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, total, discount, balanceUsed } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'Keranjang kosong' }, { status: 400 })
    }

    // Get wallet and user
    const wallet = await db.walletSaldo.findFirst()
    if (!wallet) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 })
    }

    const user = await db.user.findUnique({
      where: { id: wallet.userId },
    })

    if (!user) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 })
    }

    // Generate 4-digit struk ID
    const generateStrukId = () => {
      const strukId = Math.floor(1000 + Math.random() * 9000).toString()
      return strukId
    }

    const strukId = generateStrukId()
    const finalTotal = Math.max(0, total - discount)

    // Deduct balance if used
    if (balanceUsed > 0) {
      const balanceInRupiah = balanceUsed * 100 // 1 point = 100 rupiah

      if (wallet.balance < balanceUsed) {
        return NextResponse.json({ message: 'Saldo tidak mencukupi' }, { status: 400 })
      }

      await db.walletSaldo.update({
        where: { id: wallet.id },
        data: {
          balance: wallet.balance - balanceUsed,
        },
      })

      // Create wallet history
      await db.walletHistory.create({
        data: {
          userId: wallet.userId,
          type: 'debit',
          amount: balanceUsed,
          description: `Pembayaran pesanan #${strukId}`,
        },
      })
    }

    // Create transaction
    const transaction = await db.transaction.create({
      data: {
        strukId,
        userId: user.id,
        name: user.username,
        address: user.address || '-',
        phone: user.phone,
        total,
        discount,
        balanceUsed,
        finalTotal,
        status: 'Menunggu',
      },
    })

    // Create transaction items
    for (const item of items) {
      await db.transactionItem.create({
        data: {
          transactionId: transaction.id,
          produkId: item.produkId,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        },
      })
    }

    return NextResponse.json({
      message: 'Pesanan berhasil dibuat',
      transaction: {
        ...transaction,
        strukId,
        name: user.username,
        address: user.address,
        phone: user.phone,
      },
    })
  } catch (error) {
    console.error('Create transaction error:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}
