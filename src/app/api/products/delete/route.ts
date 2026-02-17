import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ message: 'ID harus diisi' }, { status: 400 })
    }

    await db.produk.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Produk berhasil dihapus' })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}
