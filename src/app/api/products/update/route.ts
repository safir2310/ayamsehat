import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, price, category, image, isPromo, discount, isNew } = body

    if (!id || !name || !price || !category) {
      return NextResponse.json(
        { message: 'ID, nama, harga, dan kategori harus diisi' },
        { status: 400 }
      )
    }

    const product = await db.produk.update({
      where: { id },
      data: {
        name,
        description,
        price: Number(price),
        category,
        image,
        isPromo: isPromo || false,
        discount: Number(discount) || 0,
        isNew: isNew || false,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}
