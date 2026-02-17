'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import {
  Package,
  Users,
  Gift,
  Wallet,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
} from 'lucide-react'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  category: string
  image?: string
  isPromo: boolean
  discount: number
  isNew: boolean
}

interface RedeemCode {
  id: string
  code: string
  points: number
  isActive: boolean
  isUsed: boolean
  expiredAt: string | null
}

interface ProfileToko {
  id: string
  name: string
  slogan: string
  address: string
  phone: string
  instagram?: string
  facebook?: string
  pointValue: number
  minBalance: number
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<Product[]>([])
  const [redeemCodes, setRedeemCodes] = useState<RedeemCode[]>([])
  const [profileToko, setProfileToko] = useState<ProfileToko | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Product form state
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    category: 'makanan',
    image: '',
    isPromo: false,
    discount: '0',
    isNew: false,
  })

  // Redeem code form state
  const [redeemForm, setRedeemForm] = useState({
    code: '',
    points: '',
    expiredAt: '',
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch products
      const productsRes = await fetch('/api/products')
      if (productsRes.ok) {
        const data = await productsRes.json()
        setProducts(data)
      }

      // Fetch redeem codes
      const redeemRes = await fetch('/api/admin/redeem-codes')
      if (redeemRes.ok) {
        const data = await redeemRes.json()
        setRedeemCodes(data)
      }

      // Fetch profile toko
      const profileRes = await fetch('/api/admin/profile-toko')
      if (profileRes.ok) {
        const data = await profileRes.json()
        setProfileToko(data)
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (user?.role === 'admin' && mounted) {
      fetchData()
    }
  }, [user, mounted])

  const handleSaveProduct = async () => {
    setLoading(true)
    try {
      const url = productForm.id ? '/api/products/update' : '/api/products'
      const method = productForm.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          price: Number(productForm.price),
          discount: Number(productForm.discount),
        }),
      })

      if (response.ok) {
        alert('Produk berhasil disimpan!')
        setProductForm({
          id: '',
          name: '',
          description: '',
          price: '',
          category: 'makanan',
          image: '',
          isPromo: false,
          discount: '0',
          isNew: false,
        })
        fetchData()
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    }
    setLoading(false)
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return

    try {
      const response = await fetch(`/api/products/delete?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        alert('Produk berhasil dihapus!')
        fetchData()
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    }
  }

  const handleEditProduct = (product: Product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      image: product.image || '',
      isPromo: product.isPromo,
      discount: product.discount.toString(),
      isNew: product.isNew,
    })
  }

  const handleCreateRedeemCode = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/redeem-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: redeemForm.code.toUpperCase(),
          points: Number(redeemForm.points),
          expiredAt: redeemForm.expiredAt || null,
        }),
      })

      if (response.ok) {
        alert('Kode redeem berhasil dibuat!')
        setRedeemForm({ code: '', points: '', expiredAt: '' })
        fetchData()
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    }
    setLoading(false)
  }

  const handleToggleRedeemCode = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/admin/redeem-codes/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !isActive }),
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    }
  }

  const handleDeleteRedeemCode = async (id: string) => {
    if (!confirm('Yakin ingin menghapus kode ini?')) return

    try {
      const response = await fetch(`/api/admin/redeem-codes/delete?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    }
  }

  const handleSaveProfileToko = async () => {
    if (!profileToko) return

    setLoading(true)
    try {
      const response = await fetch('/api/admin/profile-toko', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileToko),
      })

      if (response.ok) {
        alert('Profile toko berhasil diupdate!')
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    }
    setLoading(false)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <section className="py-16 bg-muted/30 min-h-screen">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </section>
    )
  }

  if (user?.role !== 'admin') {
    return null
  }

  return (
    <section className="py-16 bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Dashboard Admin</h1>
          <p className="text-muted-foreground mt-2">
            Kelola produk, user, redeem code, dan pengaturan toko
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Produk
            </TabsTrigger>
            <TabsTrigger value="redeems">
              <Gift className="h-4 w-4 mr-2" />
              Redeem Code
            </TabsTrigger>
            <TabsTrigger value="wallet">
              <Wallet className="h-4 w-4 mr-2" />
              Pengaturan Wallet
            </TabsTrigger>
            <TabsTrigger value="profile">
              <Users className="h-4 w-4 mr-2" />
              Profil Toko
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Kelola Produk</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="btn-gradient text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Produk
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{productForm.id ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Nama Produk</Label>
                          <Input
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            placeholder="Contoh: Ayam Geprek"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Deskripsi</Label>
                          <Textarea
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            placeholder="Deskripsi produk"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Harga (Rp)</Label>
                            <Input
                              type="number"
                              value={productForm.price}
                              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Diskon (%)</Label>
                            <Input
                              type="number"
                              value={productForm.discount}
                              onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Kategori</Label>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={productForm.category === 'makanan' ? 'default' : 'outline'}
                              onClick={() => setProductForm({ ...productForm, category: 'makanan' })}
                              className={productForm.category === 'makanan' ? 'btn-gradient text-white' : ''}
                            >
                              Makanan
                            </Button>
                            <Button
                              type="button"
                              variant={productForm.category === 'minuman' ? 'default' : 'outline'}
                              onClick={() => setProductForm({ ...productForm, category: 'minuman' })}
                              className={productForm.category === 'minuman' ? 'btn-gradient text-white' : ''}
                            >
                              Minuman
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Gambar URL (opsional)</Label>
                          <Input
                            value={productForm.image}
                            onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={productForm.isPromo}
                              onChange={(e) => setProductForm({ ...productForm, isPromo: e.target.checked })}
                            />
                            <span>Produk Promo</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={productForm.isNew}
                              onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                            />
                            <span>Produk Baru</span>
                          </label>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button className="flex-1 btn-gradient text-white" onClick={handleSaveProduct}>
                            <Save className="h-4 w-4 mr-2" />
                            Simpan
                          </Button>
                          {productForm.id && (
                            <Button
                              variant="outline"
                              onClick={() =>
                                setProductForm({
                                  id: '',
                                  name: '',
                                  description: '',
                                  price: '',
                                  category: 'makanan',
                                  image: '',
                                  isPromo: false,
                                  discount: '0',
                                  isNew: false,
                                })
                              }
                            >
                              <X className="h-4 w-4 mr-2" />
                              Batal
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[600px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                          <div className="flex gap-1">
                            {product.isPromo && (
                              <Badge className="gradient-fire text-white">Promo</Badge>
                            )}
                            {product.isNew && (
                              <Badge className="bg-green-500 text-white">Baru</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            {product.discount > 0 && (
                              <span className="text-sm text-muted-foreground line-through">
                                Rp {product.price.toLocaleString('id-ID')}
                              </span>
                            )}
                            <p className="font-bold text-orange-600">
                              Rp {Math.round(product.price * (1 - product.discount / 100)).toLocaleString('id-ID')}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Redeem Codes Tab */}
          <TabsContent value="redeems">
            <Card>
              <CardHeader>
                <CardTitle>Kelola Kode Redeem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Create Redeem Code Form */}
                <div className="bg-muted p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold">Buat Kode Redeem Baru</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Kode</Label>
                      <Input
                        value={redeemForm.code}
                        onChange={(e) => setRedeemForm({ ...redeemForm, code: e.target.value })}
                        placeholder="Contoh: PROMO123"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Point</Label>
                      <Input
                        type="number"
                        value={redeemForm.points}
                        onChange={(e) => setRedeemForm({ ...redeemForm, points: e.target.value })}
                        placeholder="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Expired (opsional)</Label>
                      <Input
                        type="date"
                        value={redeemForm.expiredAt}
                        onChange={(e) => setRedeemForm({ ...redeemForm, expiredAt: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button className="btn-gradient text-white" onClick={handleCreateRedeemCode}>
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Kode
                  </Button>
                </div>

                {/* Redeem Codes List */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Daftar Kode Redeem</h3>
                  <ScrollArea className="max-h-[400px]">
                    <div className="space-y-3">
                      {redeemCodes.map((code) => (
                        <div
                          key={code.id}
                          className="flex justify-between items-center p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <p className="font-mono font-bold text-lg">{code.code}</p>
                              <Badge variant={code.isActive ? 'default' : 'secondary'}>
                                {code.isActive ? 'Aktif' : 'Nonaktif'}
                              </Badge>
                              {code.isUsed && <Badge variant="destructive">Sudah Dipakai</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {code.points} Point
                              {code.expiredAt && ` • Expired: ${new Date(code.expiredAt).toLocaleDateString('id-ID')}`}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleRedeemCode(code.id, code.isActive)}
                            >
                              {code.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteRedeemCode(code.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Settings Tab */}
          <TabsContent value="wallet">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Wallet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nilai Point ke Rupiah</Label>
                  <Input
                    type="number"
                    value={profileToko?.pointValue || 100}
                    onChange={(e) =>
                      setProfileToko({ ...profileToko!, pointValue: Number(e.target.value) })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    1 Point = Rp {profileToko?.pointValue || 100}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Minimum Penggunaan Saldo (Rp)</Label>
                  <Input
                    type="number"
                    value={profileToko?.minBalance || 1000}
                    onChange={(e) =>
                      setProfileToko({ ...profileToko!, minBalance: Number(e.target.value) })
                    }
                  />
                </div>
                <Button className="btn-gradient text-white" onClick={handleSaveProfileToko}>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Pengaturan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Toko Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profil Toko</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nama Toko</Label>
                  <Input
                    value={profileToko?.name || ''}
                    onChange={(e) => setProfileToko({ ...profileToko!, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slogan</Label>
                  <Input
                    value={profileToko?.slogan || ''}
                    onChange={(e) => setProfileToko({ ...profileToko!, slogan: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alamat</Label>
                  <Textarea
                    value={profileToko?.address || ''}
                    onChange={(e) => setProfileToko({ ...profileToko!, address: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>No HP</Label>
                  <Input
                    value={profileToko?.phone || ''}
                    onChange={(e) => setProfileToko({ ...profileToko!, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram URL</Label>
                  <Input
                    value={profileToko?.instagram || ''}
                    onChange={(e) => setProfileToko({ ...profileToko!, instagram: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Facebook URL</Label>
                  <Input
                    value={profileToko?.facebook || ''}
                    onChange={(e) => setProfileToko({ ...profileToko!, facebook: e.target.value })}
                  />
                </div>
                <Button className="btn-gradient text-white" onClick={handleSaveProfileToko}>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Profil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
