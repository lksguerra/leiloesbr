'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/config'
import { Auction } from '@/types'
import { FaMapMarkerAlt, FaFileDownload, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa'
import Loading from '@/components/ui/Loading'
import PropertyPlaceholder from '@/components/ui/PropertyPlaceholder'
import Link from 'next/link'
import Image from 'next/image'

export default function AuctionDetailsPage() {
  const params = useParams()
  const [auction, setAuction] = useState<Auction | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    fetchAuctionDetails()
  }, [])

  const fetchAuctionDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setAuction(data)
    } catch (error) {
      console.error('Erro ao buscar detalhes do leilão:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading message="Carregando detalhes do imóvel..." />
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-[#333333]">Imóvel não encontrado</h2>
        <p className="mt-2 text-[#333333]">O imóvel que você está procurando não existe ou foi removido.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Navegação de Volta */}
      <div className="mb-6">
        <Link 
          href="/dashboard/auctions" 
          className="inline-flex items-center text-[#002B5B] hover:text-[#C0A000]"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          <span>Voltar para Leilões</span>
        </Link>
      </div>

      {/* Imagem e Navegação */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="relative h-96">
          {auction.image_url || auction.images?.[0] ? (
            <div className="relative w-full h-full">
              <Image
                src={auction.image_url || auction.images?.[0]}
                alt={auction.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <PropertyPlaceholder />
            </div>
          )}
          {/* Tag de tipo de leilão */}
          <div className="absolute top-4 left-4">
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-black text-[#C0A000] border border-[#C0A000]">
              {auction.type === 'judicial' ? 'Leilão Judicial' : 'Leilão Extrajudicial'}
            </span>
          </div>
          {/* Tag de desconto */}
          {auction.current_price < auction.starting_price && (
            <div className="absolute top-4 right-4">
              <span className="flex items-center justify-center h-12 w-12 rounded-full bg-[#002B5B] text-white text-sm font-bold border border-[#C0A000]">
                {calculateDiscount(auction.starting_price, auction.current_price)}%
              </span>
            </div>
          )}
        </div>
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setShowMap(false)}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                !showMap ? 'text-[#C0A000] border-b-2 border-[#C0A000]' : 'text-[#333333] hover:text-[#C0A000]'
              }`}
            >
              Fotos
            </button>
            <button
              onClick={() => setShowMap(true)}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                showMap ? 'text-[#C0A000] border-b-2 border-[#C0A000]' : 'text-[#333333] hover:text-[#C0A000]'
              }`}
            >
              Mapa
            </button>
          </div>
        </div>
      </div>

      {/* Informações do Imóvel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Título e Endereço */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#333333] mb-2">
                  <span className="text-[#C0A000]">{auction.title.split(' - ')[0]}</span>
                  {auction.title.includes(' - ') && ` - ${auction.title.split(' - ')[1]}`}
                </h1>
                <p className="text-[#333333] flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-[#002B5B]" />
                  {auction.address}
                </p>
              </div>
            </div>
          </div>

          {/* Características */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-[#333333] mb-4 border-b border-gray-200 pb-2">Características</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {auction.area && (
                <div className="flex items-center">
                  <FaRuler className="text-[#002B5B] mr-2" />
                  <div>
                    <p className="text-sm text-[#333333]">Área Útil</p>
                    <p className="font-semibold text-[#333333]">{auction.area} m²</p>
                  </div>
                </div>
              )}
              {auction.bedrooms && (
                <div className="flex items-center">
                  <FaBed className="text-[#002B5B] mr-2" />
                  <div>
                    <p className="text-sm text-[#333333]">Quartos</p>
                    <p className="font-semibold text-[#333333]">{auction.bedrooms}</p>
                  </div>
                </div>
              )}
              {auction.bathrooms && (
                <div className="flex items-center">
                  <FaBath className="text-[#002B5B] mr-2" />
                  <div>
                    <p className="text-sm text-[#333333]">Banheiros</p>
                    <p className="font-semibold text-[#333333]">{auction.bathrooms}</p>
                  </div>
                </div>
              )}
              {auction.parking_spots && (
                <div className="flex items-center">
                  <FaCar className="text-[#002B5B] mr-2" />
                  <div>
                    <p className="text-sm text-[#333333]">Vagas</p>
                    <p className="font-semibold text-[#333333]">{auction.parking_spots}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Documentos */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-[#333333] mb-4 border-b border-gray-200 pb-2">Documentos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-2 border border-[#002B5B] rounded-md shadow-sm text-sm font-medium text-[#002B5B] bg-white hover:bg-gray-50 transition-colors">
                <FaFileDownload className="mr-2" />
                Baixar Matrícula
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-[#002B5B] rounded-md shadow-sm text-sm font-medium text-[#002B5B] bg-white hover:bg-gray-50 transition-colors">
                <FaFileDownload className="mr-2" />
                Baixar Edital
              </button>
            </div>
          </div>

          {/* Descrição */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-[#333333] mb-4 border-b border-gray-200 pb-2">Descrição</h2>
            <p className="text-[#333333] whitespace-pre-line">{auction.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
            <div className="mb-4">
              <span className="text-sm font-medium text-[#333333]">Tipo de Venda</span>
              <p className="text-lg font-semibold text-[#002B5B]">{auction.category}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-[#C0A000]">
                  R$ {auction.current_price.toLocaleString('pt-BR')}
                </span>
                {auction.current_price < auction.starting_price && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    R$ {auction.starting_price.toLocaleString('pt-BR')}
                  </span>
                )}
              </div>
              {auction.current_price < auction.starting_price && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#002B5B] text-white">
                    {calculateDiscount(auction.starting_price, auction.current_price)}% de desconto
                  </span>
                </div>
              )}
            </div>

            {/* Datas dos Leilões */}
            <div className="mb-6 space-y-4 border-t border-b border-gray-200 py-4">
              <div>
                <div className="text-sm font-medium text-[#333333]">1ª Praça</div>
                <div className="text-sm text-[#333333]">
                  {new Date(auction.first_auction_date).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(auction.first_auction_date).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="text-lg font-semibold text-[#333333]">
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
                <div className="text-lg font-semibold text-[#C0A000]">
                  R$ {auction.current_price.toLocaleString('pt-BR')}
                </div>
              </div>
            </div>

            {auction.link_acesso && (
              <a
                href={auction.link_acesso}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-md text-base font-medium text-white bg-[#002B5B] hover:bg-[#001B3B] transition-colors"
              >
                <FaExternalLinkAlt className="mr-2" />
                Tenho Interesse
              </a>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-[#333333]">Informações Importantes</h3>
              <div className="mt-2 text-sm text-[#333333]">
                <p className="mb-2">• O imóvel será vendido no estado em que se encontra.</p>
                <p className="mb-2">• A venda será realizada à vista.</p>
                <p>• Eventuais débitos serão de responsabilidade do comprador.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 