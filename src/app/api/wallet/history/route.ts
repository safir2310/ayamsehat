import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const history = await db.walletHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error('Get wallet history error:', error)
    return NextResponse.json([])
  }
}
