import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code || !code.trim()) {
      return NextResponse.json({ message: 'Kode redeem harus diisi' }, { status: 400 })
    }

    // Find the redeem code
    const redeemCode = await db.redeemCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!redeemCode) {
      return NextResponse.json({ message: 'Kode redeem tidak ditemukan' }, { status: 404 })
    }

    // Check if code is active
    if (!redeemCode.isActive) {
      return NextResponse.json({ message: 'Kode redeem tidak aktif' }, { status: 400 })
    }

    // Check if code is already used
    if (redeemCode.isUsed) {
      return NextResponse.json({ message: 'Kode redeem sudah digunakan' }, { status: 400 })
    }

    // Check if code is expired
    if (redeemCode.expiredAt && new Date() > redeemCode.expiredAt) {
      return NextResponse.json({ message: 'Kode redeem sudah expired' }, { status: 400 })
    }

    // Get or create wallet
    let wallet = await db.walletSaldo.findFirst()
    if (!wallet) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 })
    }

    // Update wallet balance
    wallet = await db.walletSaldo.update({
      where: { id: wallet.id },
      data: {
        balance: wallet.balance + redeemCode.points,
      },
    })

    // Create wallet history
    await db.walletHistory.create({
      data: {
        userId: wallet.userId,
        type: 'credit',
        amount: redeemCode.points,
        description: `Redeem code: ${code}`,
      },
    })

    // Mark redeem code as used
    await db.redeemCode.update({
      where: { id: redeemCode.id },
      data: { isUsed: true },
    })

    // Create redeem history
    await db.redeemHistory.create({
      data: {
        userId: wallet.userId,
        codeId: redeemCode.id,
        points: redeemCode.points,
      },
    })

    return NextResponse.json({
      message: 'Redeem berhasil',
      points: redeemCode.points,
      newBalance: wallet.balance,
    })
  } catch (error) {
    console.error('Redeem error:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}
