'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChefHat, ShoppingCart, Menu, X, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import CartModal from './CartModal'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { totalItems } = useCart()
  const { user, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { href: '#home', label: 'Beranda' },
    { href: '#products', label: 'Produk' },
    { href: '#promo', label: 'Promo' },
    { href: '#contact', label: 'Kontak' },
  ]

  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 gradient-primary shadow-lg">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 text-white">
              <div className="rounded-full bg-white/20 p-1.5 sm:p-2">
                <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold leading-tight text-white">AYAM GEPREK</span>
                <span className="text-xs sm:text-sm font-medium text-white/90">SAMBAL IJO</span>
              </div>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-white/20 h-9 w-9 sm:h-10 sm:w-10"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>

              {/* Mobile Menu Button */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 gradient-primary shadow-lg">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-white">
            <div className="animate-fade-in animate-glow rounded-full bg-white/20 p-1.5 sm:p-2">
              <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold leading-tight text-white">AYAM GEPREK</span>
              <span className="text-xs sm:text-sm font-medium text-white/90">SAMBAL IJO</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 sm:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/90 hover:text-white transition-colors font-medium text-sm sm:text-base px-2 py-1 rounded-lg hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-white/20 h-10 w-10 sm:h-10 sm:w-10"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {totalItems > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-5 w-5 sm:h-5 sm:w-5 flex items-center justify-center bg-white text-orange-600 text-xs font-bold">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* User Actions */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-10 px-3 text-sm"
                  onClick={() => (window.location.href = '#dashboard')}
                >
                  <User className="h-4 w-4 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">{user.username}</span>
                </Button>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-10 px-3 text-sm"
                  onClick={logout}
                >
                  Keluar
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 h-10 px-4 text-sm hidden md:flex"
                onClick={() => (window.location.href = '#login')}
              >
                Masuk
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden lg:hidden">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-10 w-10">
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <nav className="flex flex-col space-y-3 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-base font-medium hover:text-orange-600 transition-colors py-3 px-4 rounded-lg hover:bg-orange-50 flex items-center justify-between"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-white/20 pt-4 mt-2">
                    {user ? (
                      <>
                        <div className="text-sm text-white/90 mb-3 px-2">
                          Halo, {user.username}
                        </div>
                        <Button
                          className="w-full h-12 text-base"
                          variant="outline"
                          onClick={() => {
                            logout()
                            setIsOpen(false)
                          }}
                        >
                          Keluar
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="w-full h-12 text-lg btn-gradient text-white"
                        onClick={() => {
                          setIsOpen(false)
                          window.location.href = '#login'
                        }}
                      >
                        Masuk
                      </Button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}
