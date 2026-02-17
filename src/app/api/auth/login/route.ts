import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, role } = body

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username dan password harus diisi' },
        { status: 400 }
      )
    }

    // Check if user exists based on role
    if (role === 'admin') {
      const admin = await db.admin.findUnique({
        where: { username },
      })

      if (!admin) {
        return NextResponse.json({ message: 'Username atau password salah' }, { status: 401 })
      }

      const isValid = await bcrypt.compare(password, admin.password)
      if (!isValid) {
        return NextResponse.json({ message: 'Username atau password salah' }, { status: 401 })
      }

      return NextResponse.json({
        user: {
          id: admin.id,
          userId: 'ADMIN',
          username: admin.username,
          email: admin.email,
          phone: admin.phone,
          role: 'admin',
        },
      })
    } else {
      const user = await db.user.findUnique({
        where: { username },
        include: { walletSaldo: true },
      })

      if (!user) {
        return NextResponse.json({ message: 'Username atau password salah' }, { status: 401 })
      }

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return NextResponse.json({ message: 'Username atau password salah' }, { status: 401 })
      }

      return NextResponse.json({
        user: {
          id: user.id,
          userId: user.userId,
          username: user.username,
          email: user.email,
          phone: user.phone,
          address: user.address,
          avatar: user.avatar,
          role: user.role,
          balance: user.walletSaldo?.balance || 0,
        },
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
