'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase/config'
import { FaHome, FaGavel, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'
import Loading from '@/components/ui/Loading'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const checkUser = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      
      if (!session) {
        router.push('/login')
        return
      }

      setUserEmail(session.user.email || null)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    checkUser()
  }, [checkUser])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading message="Carregando..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo e Nome */}
              <div className="flex-shrink-0 flex items-center">
                <FaGavel className="h-8 w-8 text-[#C0A000]" />
                <span className="ml-2 text-xl font-semibold text-white">
                  Sistema de Leilões
                </span>
              </div>

              {/* Links de Navegação */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                <a
                  href="/dashboard"
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium border-b-2 ${
                    pathname === '/dashboard'
                      ? 'text-[#C0A000] border-[#C0A000]'
                      : 'text-gray-300 border-transparent hover:text-[#C0A000]'
                  }`}
                >
                  <FaHome className="mr-2 h-4 w-4" />
                  Painel
                </a>
                <Link
                  href="/dashboard/auctions"
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium border-b-2 ${
                    pathname.startsWith('/dashboard/auctions')
                      ? 'text-[#C0A000] border-[#C0A000]'
                      : 'text-gray-300 border-transparent hover:text-[#C0A000]'
                  }`}
                >
                  <FaGavel className="mr-2 h-4 w-4" />
                  Leilões
                </Link>
              </div>
            </div>

            {/* Perfil do Usuário */}
            <div className="flex items-center">
              <div className="flex items-center text-gray-300">
                <FaUserCircle className="h-5 w-5 text-[#C0A000]" />
                <span className="ml-2 text-sm font-medium">{userEmail}</span>
                <button
                  onClick={handleSignOut}
                  className="ml-4 text-gray-300 hover:text-[#C0A000] focus:outline-none"
                >
                  <FaSignOutAlt className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
} 