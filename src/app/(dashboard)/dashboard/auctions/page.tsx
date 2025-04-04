'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/config'
import { Auction, AuctionType } from '@/types'
import { FaHeart, FaEye, FaBed, FaBath, FaCar, FaRuler } from 'react-icons/fa'
import PropertyPlaceholder from '@/components/ui/PropertyPlaceholder'
import Toast from '@/components/ui/Toast'
import Loading from '@/components/ui/Loading'
import Pagination from '@/components/ui/Pagination'
import AuctionFilters from '@/components/ui/AuctionFilters'

interface AuctionFilters {
  type: AuctionType | ''
  status: 'active' | 'ended' | 'cancelled' | ''
  minPrice: string
  maxPrice: string
  search: string
  minArea?: string
  maxArea?: string
  bedrooms?: string
  bathrooms?: string
  parkingSpots?: string
  isFavorite?: boolean
}

interface ToastState {
  show: boolean
  title: string
  message?: string
  type: 'success' | 'error' | 'info'
}

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 12

  const [filters, setFilters] = useState<AuctionFilters>({
    type: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    minArea: '',
    maxArea: '',
    bedrooms: '',
    bathrooms: '',
    parkingSpots: '',
    isFavorite: false
  })

  const [toast, setToast] = useState<ToastState>({
    show: false,
    title: '',
    message: '',
    type: 'success'
  })

  useEffect(() => {
    fetchAuctions()
  }, [filters, currentPage])

  const fetchAuctions = async () => {
    try {
      let query = supabase.from('auctions').select('*', { count: 'exact' })

      if (filters.type) {
        query = query.eq('type', filters.type)
      }

      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      if (filters.minPrice) {
        query = query.gte('starting_price', parseFloat(filters.minPrice))
      }

      if (filters.maxPrice) {
        query = query.lte('starting_price', parseFloat(filters.maxPrice))
      }

      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`)
      }

      if (filters.minArea) {
        query = query.gte('area', parseFloat(filters.minArea))
      }

      if (filters.maxArea) {
        query = query.lte('area', parseFloat(filters.maxArea))
      }

      if (filters.bedrooms) {
        query = query.eq('bedrooms', parseInt(filters.bedrooms))
      }

      if (filters.bathrooms) {
        query = query.eq('bathrooms', parseInt(filters.bathrooms))
      }

      if (filters.parkingSpots) {
        query = query.eq('parking_spots', parseInt(filters.parkingSpots))
      }

      if (filters.isFavorite) {
        query = query.eq('is_favorite', true)
      }

      const start = (currentPage - 1) * itemsPerPage
      const end = start + itemsPerPage - 1

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(start, end)

      if (error) throw error
      setAuctions(data || [])
      if (count) {
        setTotalPages(Math.ceil(count / itemsPerPage))
      }
    } catch (error) {
      console.error('Erro ao buscar leilões:', error)
      showToast('Erro ao buscar leilões', 'Ocorreu um erro ao carregar os leilões', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: AuctionFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setFilters({
      type: '',
      status: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      minArea: '',
      maxArea: '',
      bedrooms: '',
      bathrooms: '',
      parkingSpots: '',
      isFavorite: false
    })
    setCurrentPage(1)
  }

  const showToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, title, message, type })
  }

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  const toggleFavorite = async (auction: Auction) => {
    try {
      const { error } = await supabase
        .from('auctions')
        .update({ is_favorite: !auction.is_favorite })
        .eq('id', auction.id)
      
      if (error) throw error
      fetchAuctions()
      showToast(
        auction.is_favorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
        auction.is_favorite ? 'O leilão foi removido dos favoritos' : 'O leilão foi adicionado aos favoritos',
        'success'
      )
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error)
      showToast('Erro ao atualizar favorito', 'Ocorreu um erro ao atualizar o favorito', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading message="Carregando leilões..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Leilões</h1>
      </div>

      <AuctionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Grade de Leilões */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {auctions.map((auction) => (
          <div key={auction.id} className="bg-white rounded-lg shadow-lg overflow-hidden h-full border border-transparent hover:border-[#C0A000] transition-all duration-200">
            {/* Imagem do Imóvel */}
            <div className="relative h-48 w-full bg-gray-200">
              {auction.image_url || auction.images?.[0] ? (
                <img
                  src={auction.image_url || auction.images?.[0]}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <PropertyPlaceholder />
              )}
              <div className="absolute top-4 left-4">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-black text-[#C0A000] border border-[#C0A000]">
                  {auction.type === 'judicial' ? 'Judicial' : 'Extrajudicial'}
                </span>
              </div>
              {auction.status === 'active' && auction.current_price < auction.starting_price && (
                <div className="absolute top-4 right-4">
                  <span className="flex items-center justify-center h-12 w-12 rounded-full bg-[#002B5B] text-white text-sm font-bold border border-[#C0A000]">
                    {calculateDiscount(auction.starting_price, auction.current_price)}%
                  </span>
                </div>
              )}
            </div>

            {/* Informações do Leilão */}
            <div className="p-4 flex flex-col h-[calc(100%-192px)]">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                <span className="text-[#C0A000] font-bold">{auction.title.split(' - ')[0]}</span>
                {auction.title.includes(' - ') && ` - ${auction.title.split(' - ')[1]}`}
              </h3>
              
              {/* Informações das Praças */}
              <div className="mb-4 space-y-3 border-b border-gray-200 pb-4">
                <div>
                  <div className="text-sm font-medium text-[#333333]">1ª Praça</div>
                  <div className="text-sm text-[#333333]">
                    {new Date(auction.first_auction_date).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(auction.first_auction_date).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="text-base font-semibold text-[#333333]">
                    R$ {auction.starting_price.toLocaleString('pt-BR')}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-[#333333]">2ª Praça</div>
                  <div className="text-sm text-[#333333]">
                    {new Date(auction.second_auction_date).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(auction.second_auction_date).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="text-base font-semibold text-[#C0A000]">
                    R$ {auction.current_price.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>

              {auction.address && (
                <p className="text-sm text-[#333333] mb-2">
                  {auction.address}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2 mb-4">
                {auction.area && (
                  <div className="flex items-center text-sm text-[#333333]">
                    <FaRuler className="h-4 w-4 mr-1 text-[#002B5B]" />
                    {auction.area}m²
                  </div>
                )}
                {auction.bedrooms && (
                  <div className="flex items-center text-sm text-[#333333]">
                    <FaBed className="h-4 w-4 mr-1 text-[#002B5B]" />
                    {auction.bedrooms} quartos
                  </div>
                )}
                {auction.bathrooms && (
                  <div className="flex items-center text-sm text-[#333333]">
                    <FaBath className="h-4 w-4 mr-1 text-[#002B5B]" />
                    {auction.bathrooms} banheiros
                  </div>
                )}
                {auction.parking_spots && (
                  <div className="flex items-center text-sm text-[#333333]">
                    <FaCar className="h-4 w-4 mr-1 text-[#002B5B]" />
                    {auction.parking_spots} vagas
                  </div>
                )}
              </div>

              {/* Espaçador flexível para empurrar o rodapé para baixo */}
              <div className="flex-grow"></div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button 
                  onClick={() => toggleFavorite(auction)}
                  className={`${auction.is_favorite ? 'text-[#C0A000]' : 'text-gray-600'} hover:text-[#C0A000]`}
                  aria-label={auction.is_favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  <FaHeart className="h-5 w-5" />
                </button>
                <a 
                  href={`/dashboard/auctions/${auction.id}`}
                  className="text-[#002B5B] hover:text-[#C0A000]"
                  aria-label="Ver detalhes"
                >
                  <FaEye className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Status do Leilão */}
            <div className={`px-4 py-2 ${
              auction.status === 'active'
                ? 'bg-[#002B5B] text-white'
                : auction.status === 'ended'
                ? 'bg-gray-800 text-white'
                : 'bg-red-900 text-white'
            }`}>
              <p className="text-sm font-medium text-center">
                {auction.status === 'active' ? 'Ativo' : auction.status === 'ended' ? 'Finalizado' : 'Cancelado'}
                {auction.status === 'active' && (
                  <span className="ml-2">
                    até {new Date(auction.end_date).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <Toast
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        title={toast.title}
        message={toast.message}
        type={toast.type}
      />
    </div>
  )
} 