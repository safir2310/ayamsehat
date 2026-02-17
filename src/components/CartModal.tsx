'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import CheckoutModal from './CheckoutModal'

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart()
  const { user } = useAuth()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const handleCheckout = () => {
    if (!user) {
      alert('Silakan login terlebih dahulu')
      onClose()
      window.location.href = '#login'
      return
    }
    setIsCheckoutOpen(true)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">Keranjang Belanja</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[50vh]">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">Keranjang kosong</p>
                <p className="text-sm mt-2">Yuk pesan ayam geprek sekarang! 🍗</p>
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-orange-600">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {cart.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-orange-600">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
              <Button className="w-full btn-gradient text-white" onClick={handleCheckout}>
                Checkout
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  )
}
