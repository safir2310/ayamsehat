import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Admin verification code
const ADMIN_VERIFICATION_CODE = 'ADMIN123'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, email, phone, role, birthDate, verificationCode } = body

    if (!username || !password || !email || !phone) {
      return NextResponse.json(
        { message: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    // Check if username or email already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Username atau email sudah digunakan' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate 4-digit user ID
    const generateUserId = () => {
      const userId = Math.floor(1000 + Math.random() * 9000).toString()
      return userId
    }

    const userId = generateUserId()

    if (role === 'admin') {
      // Check verification code
      if (verificationCode !== ADMIN_VERIFICATION_CODE) {
        return NextResponse.json({ message: 'Kode verifikasi salah' }, { status: 400 })
      }

      // Create admin
      const admin = await db.admin.create({
        data: {
          username,
          email,
          password: hashedPassword,
          phone,
          birthDate: birthDate ? new Date(birthDate) : null,
        },
      })

      return NextResponse.json({
        message: 'Registrasi admin berhasil',
        user: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: 'admin',
        },
      })
    } else {
      // Create user
      const user = await db.user.create({
        data: {
          userId,
          username,
          email,
          password: hashedPassword,
          phone,
          role: 'user',
        },
      })

      // Create wallet balance
      await db.walletSaldo.create({
        data: {
          userId: user.id,
          balance: 0,
        },
      })

      return NextResponse.json({
        message: 'Registrasi berhasil',
        user: {
          id: user.id,
          userId: user.userId,
          username: user.username,
          email: user.email,
          role: 'user',
        },
      })
    }
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
