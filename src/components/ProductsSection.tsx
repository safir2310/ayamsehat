'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Star, Flame } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  category: string
  image?: string
  isPromo: boolean
  discount: number
  isNew: boolean
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === activeCategory)
    }

    // Filter by search
    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [search, activeCategory, products])

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: crypto.randomUUID(),
      produkId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  const categories = [
    { id: 'all', label: 'Semua' },
    { id: 'makanan', label: 'Makanan' },
    { id: 'minuman', label: 'Minuman' },
  ]

  if (loading) {
    return (
      <section id="products" className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Memuat Produk...</h2>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="products" className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3 gradient-text">
            Menu Kami
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Pilih menu favoritmu dan nikmati kelezatan ayam geprek sambal ijo! 🍗
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-6 md:mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Cari menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setActiveCategory(cat.id)}
              className={`${activeCategory === cat.id ? 'btn-gradient text-white' : ''} h-10 md:h-12 px-4 md:px-6 text-sm md:text-base`}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden card-hover flex flex-col">
              {/* Image */}
              <div className="relative h-40 sm:h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl sm:text-6xl">🍗</span>
                )}

                {/* Badges */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 md:gap-2">
                  {product.isPromo && (
                    <Badge className="gradient-fire text-white animate-pulse">
                      <Flame className="h-3 w-3 mr-1" />
                      Promo
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge className="bg-green-500 text-white">
                      Baru
                    </Badge>
                  )}
                  {product.discount > 0 && (
                    <Badge className="bg-red-500 text-white">
                      {product.discount}% OFF
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-3 md:p-4 flex flex-col flex-1">
                <div className="flex-1">
                  <h3 className="font-bold text-base md:text-lg mb-1">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-muted-foreground mb-2 md:mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Price & Rating */}
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      {product.discount > 0 && (
                        <span className="text-xs md:text-sm text-muted-foreground line-through">
                          Rp {product.price.toLocaleString('id-ID')}
                        </span>
                      )}
                      <span className="text-lg md:text-xl font-bold text-orange-600">
                        Rp {Math.round(product.price * (1 - product.discount / 100)).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 font-semibold text-sm md:text-base">4.9</span>
                    </div>
                  </div>

                  <Button
                    className="w-full btn-gradient text-white h-11 md:h-12 text-sm md:text-base"
                    onClick={() => handleAddToCart(product)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah ke Keranjang
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-base md:text-lg text-muted-foreground">
              Tidak ada produk yang ditemukan 😔
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
