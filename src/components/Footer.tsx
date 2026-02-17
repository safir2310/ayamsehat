'use client'

import { Phone, MapPin, Facebook, Instagram, Flame } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="gradient-dark text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🍗</div>
              <div>
                <h3 className="text-xl font-bold">AYAM GEPREK</h3>
                <p className="text-sm text-white/80">SAMBAL IJO</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-yellow-300" />
              <span className="font-semibold text-lg">Pedasnya Bikin Nagih</span>
              <Flame className="h-5 w-5 text-yellow-300" />
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Nikmati kelezatan ayam geprek dengan sambal ijo autentik. Gurih, pedas, dan bikin
              kamu ketagihan!
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold">Hubungi Kami</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-0.5 text-yellow-300 flex-shrink-0" />
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-white/80">085260812758</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-yellow-300 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Alamat</p>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Jl. Medan - Banda Aceh, Simpang Camat, Gampong Tijue,
                    Kec. Pidie, Kab. Pidie, 24151
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold">Ikuti Kami</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 transition-all rounded-full p-3 flex items-center justify-center group"
              >
                <Instagram className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 transition-all rounded-full p-3 flex items-center justify-center group"
              >
                <Facebook className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
              </a>
            </div>
            <div className="pt-4">
              <h5 className="font-semibold mb-2">Jam Operasional</h5>
              <p className="text-white/80 text-sm">Senin - Minggu</p>
              <p className="text-white/80 text-sm">10:00 - 22:00 WIB</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} AYAM GEPREK SAMBAL IJO. All rights reserved.
          </p>
          <p className="text-white/40 text-xs mt-2">
            Made with ❤️ for spicy food lovers
          </p>
        </div>
      </div>
    </footer>
  )
}
