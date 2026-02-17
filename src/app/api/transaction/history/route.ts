import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const transactions = await db.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Get transaction history error:', error)
    return NextResponse.json([])
  }
}
