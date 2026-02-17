'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { ChefHat, Mail, Phone, Lock, User, Calendar, Key } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultRole?: 'user' | 'admin'
}

export default function AuthModal({ isOpen, onClose, defaultRole = 'user' }: AuthModalProps) {
  const { login, register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    role: defaultRole,
  })
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    role: defaultRole,
    birthDate: '',
    verificationCode: '',
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(loginData.username, loginData.password, loginData.role)
      onClose()
    } catch (error: any) {
      alert(error.message || 'Login gagal')
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(registerData)
      alert('Registrasi berhasil! Silakan login.')
      onClose()
    } catch (error: any) {
      alert(error.message || 'Registrasi gagal')
    }
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-orange-500" />
            AYAM GEPREK SAMBAL IJO
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Masuk</TabsTrigger>
            <TabsTrigger value="register">Daftar</TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Username
                </Label>
                <Input
                  placeholder="Masukkan username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="Masukkan password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={loginData.role === 'user' ? 'default' : 'outline'}
                    className={`flex-1 ${loginData.role === 'user' ? 'btn-gradient text-white' : ''}`}
                    onClick={() => setLoginData({ ...loginData, role: 'user' })}
                  >
                    User
                  </Button>
                  <Button
                    type="button"
                    variant={loginData.role === 'admin' ? 'default' : 'outline'}
                    className={`flex-1 ${loginData.role === 'admin' ? 'btn-gradient text-white' : ''}`}
                    onClick={() => setLoginData({ ...loginData, role: 'admin' })}
                  >
                    Admin
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full btn-gradient text-white" disabled={loading}>
                {loading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>
          </TabsContent>

          {/* Register Form */}
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Username
                </Label>
                <Input
                  placeholder="Buat username"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  type="email"
                  placeholder="Masukkan email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  No HP
                </Label>
                <Input
                  type="tel"
                  placeholder="Masukkan nomor HP"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="Buat password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
              </div>

              {/* Admin-specific fields */}
              {registerData.role === 'admin' && (
                <>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Tanggal Lahir
                    </Label>
                    <Input
                      type="date"
                      value={registerData.birthDate}
                      onChange={(e) => setRegisterData({ ...registerData, birthDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Kode Verifikasi
                    </Label>
                    <Input
                      placeholder="Masukkan kode verifikasi"
                      value={registerData.verificationCode}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, verificationCode: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>Daftar sebagai</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={registerData.role === 'user' ? 'default' : 'outline'}
                    className={`flex-1 ${registerData.role === 'user' ? 'btn-gradient text-white' : ''}`}
                    onClick={() => setRegisterData({ ...registerData, role: 'user' })}
                  >
                    User
                  </Button>
                  <Button
                    type="button"
                    variant={registerData.role === 'admin' ? 'default' : 'outline'}
                    className={`flex-1 ${registerData.role === 'admin' ? 'btn-gradient text-white' : ''}`}
                    onClick={() => setRegisterData({ ...registerData, role: 'admin' })}
                  >
                    Admin
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full btn-gradient text-white" disabled={loading}>
                {loading ? 'Memproses...' : 'Daftar'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
