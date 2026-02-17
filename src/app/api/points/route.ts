import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const products = await db.produkPoint.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products point:', error)
    return NextResponse.json({ message: 'Gagal mengambil produk point' }, { status: 500 })
  }
}
