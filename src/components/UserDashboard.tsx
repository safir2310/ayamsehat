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
import { useAuth } from '@/contexts/AuthContext'
import { Wallet, History, User, MapPin, Phone, Mail, Gift, Key, Star, ShoppingBag, Sparkles } from 'lucide-react'

interface Transaction {
  id: string
  strukId: string
  total: number
  discount: number
  balanceUsed: number
  finalTotal: number
  status: string
  createdAt: string
}

interface WalletHistory {
  id: string
  type: string
  amount: number
  description: string
  createdAt: string
}

interface ProdukPoint {
  id: string
  name: string
  description: string | null
  points: number
  image: string | null
}

// Helper function to format date safely
const formatDate = (dateString: string) => {
  if (typeof window === 'undefined') {
    return dateString
  }
  const date = new Date(dateString)
  return date.toLocaleString('id-ID')
}

export default function UserDashboard() {
  // Only use Auth context on client side to avoid build-time errors
  const isClient = typeof window !== 'undefined'
  const auth = useAuth()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [walletHistory, setWalletHistory] = useState<WalletHistory[]>([])
  const [redeemCode, setRedeemCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [productsPoint, setProductsPoint] = useState<ProdukPoint[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  const [profileData, setProfileData] = useState({
    name: auth.user?.username || '',
    email: auth.user?.email || '',
    phone: auth.user?.phone || '',
    address: auth.user?.address || '',
  })

  useEffect(() => {
    if (auth.user) {
      setProfileData({
        name: auth.user.username || '',
        email: auth.user.email || '',
        phone: auth.user.phone || '',
        address: auth.user.address || '',
      })
    }
  }, [auth.user])

  const fetchData = async () => {
    try {
      // Fetch balance
      const balanceRes = await fetch('/api/wallet/balance')
      if (balanceRes.ok) {
        const data = await balanceRes.json()
        setBalance(data.balance)
      }

      // Fetch transactions
      const transRes = await fetch('/api/transaction/history')
      if (transRes.ok) {
        const data = await transRes.json()
        setTransactions(data)
      }

      // Fetch wallet history
      const walletRes = await fetch('/api/wallet/history')
      if (walletRes.ok) {
        const data = await walletRes.json()
        setWalletHistory(data)
      }

      // Fetch products point
      const pointsRes = await fetch('/api/points')
      if (pointsRes.ok) {
        const data = await pointsRes.json()
        setProductsPoint(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (auth.user && mounted) {
      fetchData()
    }
  }, [auth.user, mounted])

  const handleUpdateProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })
      if (response.ok) {
        alert('Profile berhasil diupdate!')
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    }
    setLoading(false)
  }

  const handleRedeemCode = async () => {
    if (!redeemCode.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/wallet/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: redeemCode }),
      })
      const data = await response.json()
      if (response.ok) {
        alert(`Berhasil! Anda mendapat ${data.points} point`)
        setRedeemCode('')
        fetchData()
      } else {
        alert(data.message || 'Kode tidak valid')
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    }
    setLoading(false)
  }

  const handleRedeemProduct = async (productId: string, productName: string, points: number) => {
    if (!confirm(`Tukar ${points} point untuk ${productName}?`)) return

    setLoading(true)
    try {
      const response = await fetch('/api/points/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      const data = await response.json()
      if (response.ok) {
        alert(`Berhasil menukar ${productName}!`)
        fetchData()
      } else {
        alert(data.message || 'Gagal menukar produk')
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    }
    setLoading(false)
  }

  // Prevent hydration mismatch - don't render user-specific content until mounted
  if (!mounted) {
    return (
      <section className="py-16 bg-muted/30 min-h-screen">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-48 bg-muted rounded"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!auth.user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">Silakan login terlebih dahulu</p>
      </div>
    )
  }

  return (
    <section id="dashboard" className="py-6 sm:py-12 bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero Section */}
        <div className="gradient-primary rounded-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-bold border-2 border-white/30">
                {auth.user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
                  Halo, {auth.user.username}!
                </h1>
                <p className="text-white/90 text-sm md:text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {auth.user.address || 'Belum ada alamat'}
                </p>
                <p className="text-white/80 text-xs md:text-sm mt-1">
                  ID: {auth.user.userId}
                </p>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-yellow-300" />
                      <div>
                        <p className="text-white/80 text-xs sm:text-sm">Saldo Point</p>
                        <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                          {balance}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/70 text-xs sm:text-sm">≈ Rp</p>
                      <p className="font-semibold text-sm md:text-base">
                        {(balance * 100).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card className="bg-gradient-to-br from-orange-400 to-orange-500 text-white border-0">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" />
                <div>
                  <p className="text-white/90 text-xs md:text-sm">Total Pesanan</p>
                  <p className="text-xl md:text-2xl font-bold">{transactions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-400 to-amber-500 text-white border-0">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <Star className="h-5 w-5 md:h-6 md:w-6" />
                <div>
                  <p className="text-white/90 text-xs md:text-sm">Tukar Poin</p>
                  <p className="text-xl md:text-2xl font-bold">{productsPoint.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-400 to-green-500 text-white border-0">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <Wallet className="h-5 w-5 md:h-6 md:w-6" />
                <div>
                  <p className="text-white/90 text-xs md:text-sm">Mutasi</p>
                  <p className="text-xl md:text-2xl font-bold">{walletHistory.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-400 to-red-500 text-white border-0">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <Gift className="h-5 w-5 md:h-6 md:w-6" />
                <div>
                  <p className="text-white/90 text-xs md:text-sm">Redeem</p>
                  <p className="text-xl md:text-2xl font-bold">Kode</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full h-12 md:h-14">
            <TabsTrigger value="profile" className="text-xs md:text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <User className="h-4 w-4 md:mr-2" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="tukar-point" className="text-xs md:text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Gift className="h-4 w-4 md:mr-2" />
              <span className="hidden sm:inline">Tukar</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="text-xs md:text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Wallet className="h-4 w-4 md:mr-2" />
              <span className="hidden sm:inline">Dompet</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs md:text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <History className="h-4 w-4 md:mr-2" />
              <span className="hidden sm:inline">Riwayat</span>
            </TabsTrigger>
            <TabsTrigger value="redeem" className="text-xs md:text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Key className="h-4 w-4 md:mr-2" />
              <span className="hidden sm:inline">Redeem</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profil Saya
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm md:text-base">
                      <User className="h-4 w-4" />
                      Username
                    </Label>
                    <Input value={profileData.name} disabled className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm md:text-base">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm md:text-base">
                      <Phone className="h-4 w-4" />
                      No HP
                    </Label>
                    <Input value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm md:text-base">
                      <MapPin className="h-4 w-4" />
                      ID User
                    </Label>
                    <Input value={auth.user.userId} disabled className="h-11" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm md:text-base">
                    <MapPin className="h-4 w-4" />
                    Alamat
                  </Label>
                  <Textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    placeholder="Masukkan alamat lengkap"
                    rows={3}
                    className="text-sm md:text-base"
                  />
                </div>

                <Button className="w-full btn-gradient text-white h-12 text-base md:text-lg" onClick={handleUpdateProfile} disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>

                <div className="pt-4 border-t">
                  <Button variant="destructive" onClick={auth.logout} className="w-full h-11 text-base md:text-base">
                    Keluar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tukar Point Tab */}
          <TabsContent value="tukar-point">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Tukar Point
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm md:text-base text-orange-900 dark:text-orange-100">
                        Saldo Anda: <span className="text-orange-600 dark:text-orange-400">{balance} Point</span>
                      </p>
                      <p className="text-xs md:text-sm text-orange-700 dark:text-orange-300 mt-1">
                        Tukarkan point dengan produk yang tersedia di bawah ini. 1 Point = Rp 100
                      </p>
                    </div>
                  </div>
                </div>

                {productsPoint.length === 0 ? (
                  <div className="text-center py-8 md:py-12">
                    <Gift className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-sm md:text-base text-muted-foreground">Belum ada produk yang dapat ditukar</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] md:h-[600px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-4">
                      {productsPoint.map((product) => (
                        <Card key={product.id} className="border-2 hover:border-orange-400 transition-all hover:shadow-md">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="aspect-square bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950 rounded-lg flex items-center justify-center">
                                <Gift className="h-12 w-12 md:h-16 md:w-16 text-orange-500 dark:text-orange-400" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-base md:text-lg mb-1">{product.name}</h3>
                                {product.description && (
                                  <p className="text-sm md:text-base text-muted-foreground line-clamp-2">
                                    {product.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t">
                                <Badge className="bg-orange-500 text-white text-sm md:text-base px-3 py-1">
                                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                  {product.points} Point
                                </Badge>
                                <Button
                                  size="sm"
                                  onClick={() => handleRedeemProduct(product.id, product.name, product.points)}
                                  disabled={loading || balance < product.points}
                                  className={balance < product.points ? 'opacity-50 cursor-not-allowed' : 'btn-gradient'}
                                >
                                  {balance < product.points ? 'Saldo Kurang' : 'Tukar'}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Riwayat Dompet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] md:h-[400px]">
                  {walletHistory.length === 0 ? (
                    <div className="text-center py-6 md:py-8 text-muted-foreground">
                      <p className="text-sm md:text-base">Belum ada riwayat transaksi dompet</p>
                    </div>
                  ) : (
                    <div className="space-y-2 md:space-y-3">
                      {walletHistory.map((history) => (
                        <div
                          key={history.id}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg gap-2 md:gap-4"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm md:text-base">{history.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(history.createdAt)}
                            </p>
                          </div>
                          <Badge
                            variant={history.type === 'credit' ? 'default' : 'destructive'}
                            className={
                              history.type === 'credit'
                                ? 'btn-gradient text-white'
                                : 'bg-red-500 text-white'
                            }
                          >
                            {history.type === 'credit' ? '+' : '-'}
                            {history.amount} Point
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Riwayat Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[350px] md:h-[500px]">
                  {transactions.length === 0 ? (
                    <div className="text-center py-6 md:py-8 text-muted-foreground">
                      <p className="text-sm md:text-base">Belum ada riwayat pesanan</p>
                    </div>
                  ) : (
                    <div className="space-y-3 md:space-y-4">
                      {transactions.map((trans) => (
                        <div
                          key={trans.id}
                          className="p-3 md:p-4 border rounded-lg space-y-2 md:space-y-3 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 md:gap-3">
                            <div>
                              <p className="font-semibold text-base md:text-lg">ID: #{trans.strukId}</p>
                              <p className="text-xs md:text-sm text-muted-foreground">
                                {formatDate(trans.createdAt)}
                              </p>
                            </div>
                            <Badge
                              variant={
                                trans.status === 'Selesai'
                                  ? 'default'
                                  : trans.status === 'Diproses'
                                  ? 'secondary'
                                  : 'outline'
                              }
                              className="text-xs md:text-sm"
                            >
                              {trans.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 md:space-y-2 text-sm md:text-base">
                            <div className="flex justify-between">
                              <span>Total:</span>
                              <span className="font-medium">Rp {trans.total.toLocaleString('id-ID')}</span>
                            </div>
                            {trans.discount > 0 && (
                              <div className="flex justify-between text-green-600">
                                <span>Diskon:</span>
                                <span className="font-medium">-Rp {trans.discount.toLocaleString('id-ID')}</span>
                              </div>
                            )}
                            {trans.balanceUsed > 0 && (
                              <div className="flex justify-between text-orange-600">
                                <span>Saldo Dipakai:</span>
                                <span className="font-medium">-{trans.balanceUsed} Point</span>
                              </div>
                            )}
                            <div className="flex justify-between font-bold pt-2 md:pt-3 border-t">
                              <span>Total Bayar:</span>
                              <span className="text-orange-600 font-medium">
                                Rp {trans.finalTotal.toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Redeem Tab */}
          <TabsContent value="redeem">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Kode Redeem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm md:text-base">
                    <Key className="h-4 w-4" />
                    Masukkan Kode Redeem
                  </Label>
                  <Input
                    placeholder="Contoh: PROMO123"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value)}
                    className="text-base md:text-lg h-12"
                  />
                  <Button
                    className="w-full btn-gradient text-white h-12 text-base md:text-lg"
                    onClick={handleRedeemCode}
                    disabled={loading}
                  >
                    {loading ? 'Memproses...' : 'Tukar Kode'}
                  </Button>
                </div>

                <div className="bg-muted p-3 md:p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold text-sm md:text-base">Info Redeem Code</h4>
                  <ul className="text-sm md:text-base text-muted-foreground space-y-1 md:space-y-2 list-disc list-inside">
                    <li>Masukkan kode redeem yang valid</li>
                    <li>Kode redeem hanya bisa digunakan sekali</li>
                    <li>Setiap kode memberikan point tertentu</li>
                    <li>1 Point = Rp 100</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
