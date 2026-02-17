import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, address } = body

    // Get user from localStorage - in production use proper auth
    const wallet = await db.walletSaldo.findFirst()
    if (!wallet) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 })
    }

    // Update user
    const user = await db.user.update({
      where: { id: wallet.userId },
      data: {
        email: email,
        phone: phone,
        address: address,
      },
    })

    return NextResponse.json({
      message: 'Profile berhasil diupdate',
      user,
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}
