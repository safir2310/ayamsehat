import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const products = await db.produk.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, category, image, isPromo, discount, isNew } = body

    if (!name || !price || !category) {
      return NextResponse.json(
        { message: 'Nama, harga, dan kategori harus diisi' },
        { status: 400 }
      )
    }

    const product = await db.produk.create({
      data: {
        name,
        description,
        price: Number(price),
        category,
        image,
        isPromo: isPromo || false,
        discount: discount || 0,
        isNew: isNew || false,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}
