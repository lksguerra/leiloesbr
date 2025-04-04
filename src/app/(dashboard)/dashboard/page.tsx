'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/config'
import { Auction } from '@/types'
import { FaBed, FaBath, FaCar, FaRuler, FaEye, FaGavel, FaHome, FaUser, FaChartBar } from 'react-icons/fa'
import Loading from '@/components/ui/Loading'
import Link from 'next/link'

interface DashboardStats {
  totalAuctions: number
  activeAuctions: number
  totalUsers: number
  totalBids: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAuctions: 0,
    activeAuctions: 0,
    totalUsers: 0,
    totalBids: 0
  })
  const [recentAuctions, setRecentAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Buscar estatísticas
      const { data: auctionsData, error: auctionsError } = await supabase
        .from('auctions')
        .select('id, status')
      
      if (auctionsError) throw auctionsError
      
      const totalAuctions = auctionsData.length
      const activeAuctions = auctionsData.filter(a => a.status === 'active').length
      
      // Buscar dados de usuários
      const { count: usersCount, error: usersError } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
      
      if (usersError) throw usersError
      
      // Buscar dados de lances
      const { count: bidsCount, error: bidsError } = await supabase
        .from('bids')
        .select('id', { count: 'exact' })
      
      if (bidsError) throw bidsError
      
      setStats({
        totalAuctions,
        activeAuctions,
        totalUsers: usersCount || 0,
        totalBids: bidsCount || 0
      })
      
      // Buscar leilões recentes
      const { data: recentData, error: recentError } = await supabase
        .from('auctions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4)
      
      if (recentError) throw recentError
      setRecentAuctions(recentData || [])
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading message="Carregando dados..." />
      </div>
    )
  }

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-[#333333]">Painel</h1>
      
      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-lg rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-[#002B5B] rounded-md p-3">
                <FaGavel className="h-6 w-6 text-[#C0A000]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-[#333333] truncate">
                    Total de Leilões
                  </dt>
                  <dd>
                    <div className="text-lg font-bold text-[#002B5B]">
                      {stats.totalAuctions}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-[#002B5B] rounded-md p-3">
                <FaChartBar className="h-6 w-6 text-[#C0A000]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-[#333333] truncate">
                    Leilões Ativos
                  </dt>
                  <dd>
                    <div className="text-lg font-bold text-[#002B5B]">
                      {stats.activeAuctions}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-[#002B5B] rounded-md p-3">
                <FaUser className="h-6 w-6 text-[#C0A000]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-[#333333] truncate">
                    Total de Usuários
                  </dt>
                  <dd>
                    <div className="text-lg font-bold text-[#002B5B]">
                      {stats.totalUsers}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-[#002B5B] rounded-md p-3">
                <FaHome className="h-6 w-6 text-[#C0A000]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-[#333333] truncate">
                    Total de Lances
                  </dt>
                  <dd>
                    <div className="text-lg font-bold text-[#002B5B]">
                      {stats.totalBids}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Leilões Recentes */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-[#333333]">Leilões Recentes</h2>
            <Link 
              href="/dashboard/auctions" 
              className="text-sm font-medium text-[#002B5B] hover:text-[#C0A000]"
            >
              Ver todos
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentAuctions.length > 0 ? (
            recentAuctions.map((auction) => (
              <div key={auction.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                      {auction.image_url || auction.images?.[0] ? (
                        <img
                          src={auction.image_url || auction.images?.[0]}
                          alt={auction.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-300">
                          <FaHome className="h-8 w-8 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-medium">
                        <span className="text-[#C0A000] font-bold">{auction.title.split(' - ')[0]}</span>
                        {auction.title.includes(' - ') && ` - ${auction.title.split(' - ')[1]}`}
                      </h3>
                      <div className="mt-1 flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          auction.status === 'active' 
                            ? 'bg-[#002B5B] text-white' 
                            : auction.status === 'ended'
                            ? 'bg-gray-800 text-white'
                            : 'bg-red-900 text-white'
                        }`}>
                          {auction.status === 'active' ? 'Ativo' : auction.status === 'ended' ? 'Finalizado' : 'Cancelado'}
                        </span>
                        <span className="ml-2 text-sm text-[#333333]">
                          {auction.address}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline">
                      <span className="text-base font-bold text-[#C0A000]">
                        R$ {auction.current_price.toLocaleString('pt-BR')}
                      </span>
                      {auction.current_price < auction.starting_price && (
                        <span className="ml-2 text-xs text-gray-500 line-through">
                          R$ {auction.starting_price.toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      <Link 
                        href={`/dashboard/auctions/${auction.id}`}
                        className="inline-flex items-center px-2.5 py-1.5 border border-[#002B5B] text-xs font-medium rounded text-[#002B5B] bg-white hover:bg-gray-50"
                      >
                        <FaEye className="h-3 w-3 mr-1" />
                        Ver detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-500">Nenhum leilão encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 