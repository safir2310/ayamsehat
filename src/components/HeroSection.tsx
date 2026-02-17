'use client'

import { Button } from '@/components/ui/button'
import { ChefHat, Flame } from 'lucide-react'

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden py-12 md:py-16 lg:py-24">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-primary opacity-95" />
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-red-500/20" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 md:space-y-6 animate-fade-up">
          {/* Logo with Glow */}
          <div className="inline-flex items-center justify-center animate-fade-in animate-glow rounded-full bg-white/20 backdrop-blur-sm p-4 md:p-6 mb-4 md:mb-8">
            <ChefHat className="h-14 w-14 md:h-20 md:w-20 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight px-2">
            AYAM GEPREK
            <br />
            <span className="text-yellow-200">SAMBAL IJO</span>
          </h1>

          {/* Slogan */}
          <div className="flex items-center justify-center gap-2 md:gap-3 text-white text-base md:text-lg">
            <Flame className="h-5 w-5 md:h-6 md:w-6 animate-pulse" />
            <span className="font-semibold text-sm md:text-base">Pedasnya Bikin Nagih</span>
            <Flame className="h-5 w-5 md:h-6 md:w-6 animate-pulse" />
          </div>

          {/* Description */}
          <p className="text-white/90 text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-4 leading-relaxed">
            Nikmati kelezatan ayam geprek dengan sambal ijo autentik. Gurih, pedas, dan bikin kamu
            ketagihan! Pesan sekarang dan rasakan sensasinya! 🍗
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center pt-4 md:pt-6">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-yellow-100 hover:scale-105 transition-all text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full sm:w-auto h-12 md:h-14"
              onClick={() => (window.location.href = '#products')}
            >
              Pesan Sekarang
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/20 hover:scale-105 transition-all text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full sm:w-auto h-12 md:h-14"
              onClick={() => (window.location.href = '#promo')}
            >
              Lihat Promo
            </Button>
          </div>

          {/* Promo Badge */}
          <div className="pt-4 md:pt-8">
            <div className="inline-flex items-center gap-2 md:gap-2 bg-yellow-400 text-orange-900 px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-base shadow-lg animate-bounce">
              🔥 PROMO SPESIAL HARI INI - Beli 2 Lebih Hemat! 🔥
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
