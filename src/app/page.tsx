'use client'

import { useState, useEffect } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import ProductsSection from '@/components/ProductsSection'
import AuthModal from '@/components/AuthModal'
import AdminDashboard from '@/components/AdminDashboard'
import Footer from '@/components/Footer'

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Handle hash change for navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash === 'login' || hash === 'register') {
        setIsAuthModalOpen(true)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', handleHashChange)
      handleHashChange()

      return () => window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-background">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-1">
            {/* Hero Section */}
            <HeroSection />

            {/* Products Section */}
            <ProductsSection />

            {/* Promo Section */}
            <section id="promo" className="py-16 bg-gradient-to-br from-orange-50 to-yellow-50">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
                  Promo Spesial 🎉
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  Nikmati berbagai promo menarik dan diskon spesial setiap hari!
                </p>
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-3">🍗</div>
                    <h3 className="font-bold text-lg mb-2">Beli 2 Gratis 1</h3>
                    <p className="text-sm text-muted-foreground">
                      Beli 2 paket ayam geprek, gratis 1 paket nasi!
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-3">🔥</div>
                    <h3 className="font-bold text-lg mb-2">Diskon 20%</h3>
                    <p className="text-sm text-muted-foreground">
                      Diskon 20% untuk pembelian di atas Rp 50.000!
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-3">💰</div>
                    <h3 className="font-bold text-lg mb-2">Cashback Point</h3>
                    <p className="text-sm text-muted-foreground">
                      Dapatkan cashback point hingga 100 point per transaksi!
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Admin Dashboard */}
            <AdminDashboard />
          </main>

          {/* Footer */}
          <Footer />

          {/* Auth Modal */}
          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}
