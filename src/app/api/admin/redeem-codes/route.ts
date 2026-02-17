import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const redeemCodes = await db.redeemCode.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(redeemCodes)
  } catch (error) {
    console.error('Get redeem codes error:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, points, expiredAt } = body

    if (!code || !points) {
      return NextResponse.json(
        { message: 'Kode dan point harus diisi' },
        { status: 400 }
      )
    }

    // Check if code already exists
    const existingCode = await db.redeemCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (existingCode) {
      return NextResponse.json(
        { message: 'Kode sudah ada' },
        { status: 400 }
      )
    }

    const redeemCode = await db.redeemCode.create({
      data: {
        code: code.toUpperCase(),
        points: Number(points),
        expiredAt: expiredAt ? new Date(expiredAt) : null,
        isActive: true,
        isUsed: false,
      },
    })

    return NextResponse.json(redeemCode)
  } catch (error) {
    console.error('Create redeem code error:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}
