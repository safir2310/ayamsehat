import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const profile = await db.profileToko.findFirst()
    if (!profile) {
      return NextResponse.json({
        id: 'default',
        name: 'AYAM GEPREK SAMBAL IJO',
        slogan: 'Pedasnya Bikin Nagih 🔥🔥',
        address: '',
        phone: '085260812758',
        pointValue: 100,
        minBalance: 1000,
      })
    }
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Get profile toko error:', error)
    return NextResponse.json({})
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const profile = await db.profileToko.upsert({
      where: { id: body.id || 'default' },
      update: body,
      create: {
        id: 'default',
        ...body,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Update profile toko error:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}
