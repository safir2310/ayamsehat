'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { ShoppingCart, Wallet, Check } from 'lucide-react'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

interface WalletBalance {
  balance: number
  pointValue: number
  minBalance: number
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const [balanceData, setBalanceData] = useState<WalletBalance | null>(null)
  const [balanceToUse, setBalanceToUse] = useState(0)
  const [useAllBalance, setUseAllBalance] = useState(false)
  const [redeemCode, setRedeemCode] = useState('')
  const [redeemPoints, setRedeemPoints] = useState(0)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart')

  useEffect(() => {
    if (isOpen && user) {
      fetchWallet()
    }
  }, [isOpen, user])

  const fetchWallet = async () => {
    try {
      const response = await fetch('/api/wallet/balance')
      if (response.ok) {
        const data = await response.json()
        setBalanceData(data)
      }
    } catch (error) {
      console.error('Error fetching wallet:', error)
    }
  }

  const handleApplyRedeem = async () => {
    if (!redeemCode.trim()) return

    try {
      const response = await fetch('/api/wallet/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: redeemCode }),
      })

      const data = await response.json()
      if (response.ok) {
        setRedeemPoints(data.points)
        fetchWallet()
      } else {
        alert(data.message || 'Kode tidak valid')
      }
    } catch (error) {
      console.error('Error applying redeem code:', error)
    }
  }

  const handleUseAllBalance = () => {
    if (!balanceData) return
    const maxUsable = Math.max(0, totalPrice - redeemPoints)
    const usable = Math.min(balanceData.balance, maxUsable)
    setBalanceToUse(usable)
    setUseAllBalance(true)
  }

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/transaction/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total: totalPrice,
          discount: redeemPoints + balanceToUse,
          balanceUsed: balanceToUse,
        }),
      })

      if (!response.ok) {
        throw new Error('Checkout gagal')
      }

      const data = await response.json()

      // Send WhatsApp message
      const waMessage = `Halo Ayam Geprek Sambal Ijo! 🍗
      
Saya mau pesan:

${cart.map(item => `• ${item.name} x${item.quantity} - Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`).join('\n')}

Subtotal: Rp ${totalPrice.toLocaleString('id-ID')}
Diskon: Rp ${data.discount.toLocaleString('id-ID')}
Total Bayar: Rp ${data.finalTotal.toLocaleString('id-ID')}

ID Pesanan: ${data.strukId}
Nama: ${data.name}
Alamat: ${data.address}
No HP: ${data.phone}

Mohon diproses, terima kasih! 🙏`

      const waNumber = '6285260812758'
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`

      clearCart()
      setStep('success')

      // Open WhatsApp after a short delay
      setTimeout(() => {
        window.open(waUrl, '_blank')
        onClose()
      }, 2000)
    } catch (error) {
      alert('Terjadi kesalahan saat checkout')
      console.error(error)
    }
    setLoading(false)
  }

  const finalTotal = Math.max(0, totalPrice - redeemPoints - balanceToUse)
  const balanceInRupiah = balanceData ? balanceData.balance * balanceData.pointValue : 0

  if (step === 'success') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2 gradient-text">Pesanan Berhasil!</h2>
            <p className="text-muted-foreground">
              Pesanan Anda sedang diproses. Mengarahkan ke WhatsApp...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Checkout Pesanan</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          {/* Small Hero Section */}
          <div className="gradient-primary rounded-lg p-4 mb-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">AYAM GEPREK SAMBAL IJO</h3>
                <p className="text-sm text-white/90">Pedasnya Bikin Nagih 🔥🔥</p>
              </div>
              <ShoppingCart className="h-8 w-8" />
            </div>
          </div>

          {/* Cart Items */}
          <div className="space-y-3 mb-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    x{item.quantity} × Rp {item.price.toLocaleString('id-ID')}
                  </p>
                </div>
                <p className="font-semibold text-orange-600">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Redeem Code */}
          <div className="space-y-3 mb-4">
            <Label className="font-semibold">Kode Redeem</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Masukkan kode redeem"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value)}
              />
              <Button onClick={handleApplyRedeem} variant="outline">
                Terapkan
              </Button>
            </div>
            {redeemPoints > 0 && (
              <div className="text-sm text-green-600">
                ✓ Mendapat Rp {redeemPoints.toLocaleString('id-ID')} dari redeem code
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Balance Section */}
          <div className="space-y-3 mb-4">
            <Label className="font-semibold flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Gunakan Saldo Point
            </Label>
            {balanceData && (
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Saldo Tersedia:</span>
                  <span className="font-semibold text-orange-600">
                    {balanceData.balance} Point (Rp {balanceInRupiah.toLocaleString('id-ID')})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm whitespace-nowrap">Gunakan:</Label>
                  <Input
                    type="number"
                    value={balanceToUse}
                    onChange={(e) => setBalanceToUse(Number(e.target.value))}
                    max={Math.min(balanceData.balance, totalPrice - redeemPoints)}
                    min={0}
                    className="flex-1"
                  />
                  <span className="text-sm">Point</span>
                  <span className="text-sm text-muted-nowrap">
                    (Rp {(balanceToUse * (balanceData.pointValue || 100)).toLocaleString('id-ID')})
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleUseAllBalance}
                  disabled={balanceData.balance === 0}
                >
                  Gunakan Semua Saldo
                </Button>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Summary */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            {redeemPoints > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Diskon Redeem:</span>
                <span>-Rp {redeemPoints.toLocaleString('id-ID')}</span>
              </div>
            )}
            {balanceToUse > 0 && balanceData && (
              <div className="flex justify-between text-orange-600">
                <span>Diskon Saldo:</span>
                <span>-Rp {(balanceToUse * balanceData.pointValue).toLocaleString('id-ID')}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Akhir:</span>
              <span className="text-orange-600">Rp {finalTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </ScrollArea>

        <div className="pt-4">
          <Button
            className="w-full btn-gradient text-white h-12"
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
          >
            {loading ? 'Memproses...' : 'Checkout & Kirim WhatsApp'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
