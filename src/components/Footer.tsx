'use client'

import { useState, useEffect } from 'react'
import { Facebook, Instagram, Flame, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const [profileToko, setProfileToko] = useState<any>(null)

  useEffect(() => {
    // Fetch profile toko data
    fetch('/api/admin/profile-toko')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setProfileToko(data)
        }
      })
      .catch(err => console.error('Error fetching profile:', err))
  }, [])

  return (
    <footer className="gradient-dark text-white mt-auto">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl sm:text-4xl">🍗</div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">AYAM GEPREK</h3>
                <p className="text-xs sm:text-sm text-white/80">SAMBAL IJO</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300" />
              <span className="font-semibold text-sm sm:text-base">Pedasnya Bikin Nagih</span>
              <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300" />
            </div>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
              Nikmati kelezatan ayam geprek dengan sambal ijo autentik. Gurih, pedas, dan bikin
              kamu ketagihan!
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-bold">Kontak Kami</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-yellow-300 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-xs sm:text-sm">Telepon</p>
                  <p className="text-white/80 text-sm sm:text-base">
                    {profileToko?.phone || '085260812758'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-yellow-300 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-xs sm:text-sm">Alamat</p>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                    {profileToko?.address || 'Jl. Medan - Banda Aceh, Simpang Camat, Gampong Tijue, Kec. Pidie, Kab. Pidie, 24151'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-bold">Ikuti Kami</h4>
            <div className="flex gap-3 sm:gap-4">
              <a
                href={profileToko?.instagram || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 transition-all rounded-full p-2.5 sm:p-3 flex items-center justify-center group"
              >
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:scale-110 transition-transform" />
              </a>
              <a
                href={profileToko?.facebook || "https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 transition-all rounded-full p-2.5 sm:p-3 flex items-center justify-center group"
              >
                <Facebook className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-bold">Jam Operasional</h4>
            <div className="space-y-2">
              <p className="text-white/80 text-xs sm:text-sm">Senin - Minggu</p>
              <p className="text-white/80 text-xs sm:text-sm font-semibold">10:00 - 22:00 WIB</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-white/60 text-xs sm:text-sm">
            © {new Date().getFullYear()} AYAM GEPREK SAMBAL IJO. All rights reserved.
          </p>
          <p className="text-white/40 text-[10px] sm:text-xs mt-1 sm:mt-2">
            Made with ❤️ for spicy food lovers
          </p>
        </div>
      </div>
    </footer>
  )
}
