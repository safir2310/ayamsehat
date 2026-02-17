import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // For simplicity, get user from localStorage - in production use proper auth
    // This endpoint will work when called from the frontend
    const wallet = await db.walletSaldo.findFirst()
    const profileToko = await db.profileToko.findFirst()

    return NextResponse.json({
      balance: wallet?.balance || 0,
      pointValue: profileToko?.pointValue || 100,
      minBalance: profileToko?.minBalance || 1000,
    })
  } catch (error) {
    console.error('Get balance error:', error)
    return NextResponse.json({ balance: 0, pointValue: 100, minBalance: 1000 })
  }
}
