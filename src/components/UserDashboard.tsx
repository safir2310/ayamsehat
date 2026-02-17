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
import { Wallet, History, User, MapPin, Phone, Mail, Gift, Key } from 'lucide-react'

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

// Helper function to format date safely
const formatDate = (dateString: string) => {
  if (typeof window === 'undefined') {
    return dateString
  }
  const date = new Date(dateString)
  return date.toLocaleString('id-ID')
}

export default function UserDashboard() {
  const { user, logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [walletHistory, setWalletHistory] = useState<WalletHistory[]>([])
  const [redeemCode, setRedeemCode] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [profileData, setProfileData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  })

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
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (user && mounted) {
      fetchData()
    }
  }, [user, mounted])

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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">Silakan login terlebih dahulu</p>
      </div>
    )
  }

  return (
    <section id="dashboard" className="py-12 sm:py-16 bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Dashboard Saya</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Halo, {user.username}! Kelola akun dan pesananmu di sini.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="profile" className="h-10 md:h-12 text-sm md:text-base">
              <User className="h-4 w-4 mr-1 md:mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="wallet" className="h-10 md:h-12 text-sm md:text-base">
              <Wallet className="h-4 w-4 mr-1 md:mr-2" />
              Dompet
            </TabsTrigger>
            <TabsTrigger value="history" className="h-10 md:h-12 text-sm md:text-base">
              <History className="h-4 w-4 mr-1 md:mr-2" />
              Riwayat
            </TabsTrigger>
            <TabsTrigger value="redeem" className="h-10 md:h-12 text-sm md:text-base">
              <Gift className="h-4 w-4 mr-1 md:mr-2" />
              Redeem
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Profil Saya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-center mb-4 md:mb-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 gradient-primary rounded-full flex items-center justify-center text-white text-3xl md:text-4xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </div>

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
                    <Input value={user.userId} disabled className="h-11" />
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
                  <Button variant="destructive" onClick={logout} className="w-full h-11 text-base md:text-base">
                    Keluar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Saldo Point Saya
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="gradient-primary rounded-lg p-4 md:p-6 text-white text-center mb-4 md:mb-6">
                  <p className="text-white/80 text-sm md:text-base mb-1">Saldo Tersedia</p>
                  <p className="text-3xl md:text-4xl font-bold">{balance} Point</p>
                  <p className="text-white/80 text-sm md:text-base mt-2">
                    ≈ Rp {(balance * 100).toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-base md:text-lg">Riwayat Dompet</h3>
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
                </div>
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
                  <Gift className="h-5 w-5" />
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
