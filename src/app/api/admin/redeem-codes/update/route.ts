import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, isActive } = body

    const redeemCode = await db.redeemCode.update({
      where: { id },
      data: { isActive },
    })

    return NextResponse.json(redeemCode)
  } catch (error) {
    console.error('Update redeem code error:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}
