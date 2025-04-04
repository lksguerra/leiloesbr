import { useState } from 'react'
import { AuctionType } from '@/types'
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa'

interface AuctionFiltersProps {
  filters: {
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
  onFilterChange: (filters: any) => void
  onClearFilters: () => void
}

export default function AuctionFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: AuctionFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const isCheckbox = type === 'checkbox'
    
    onFilterChange({
      ...filters,
      [name]: isCheckbox 
        ? (e.target as HTMLInputElement).checked 
        : value
    })
  }

  const filterStyles = {
    label: "block text-[#333333] text-sm font-medium mb-1",
    input: "shadow-sm bg-white border border-gray-300 focus:border-[#C0A000] focus:ring focus:ring-[#C0A000] focus:ring-opacity-20 rounded-md w-full text-[#333333] placeholder-gray-500 px-3 py-2 sm:text-sm",
    select: "shadow-sm bg-white border border-gray-300 focus:border-[#C0A000] focus:ring focus:ring-[#C0A000] focus:ring-opacity-20 rounded-md w-full text-[#333333] px-3 py-2 sm:text-sm",
    button: {
      clear: "w-full py-2 px-4 border border-[#002B5B] rounded-md shadow-sm text-sm font-medium text-[#002B5B] bg-white hover:bg-gray-50 focus:outline-none",
      advanced: "text-[#002B5B] hover:text-[#C0A000] text-sm font-medium underline focus:outline-none",
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex items-center mb-4">
        <FaFilter className="text-[#C0A000] mr-2" />
        <h2 className="text-lg font-medium text-[#333333]">Filtros</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Busca */}
        <div>
          <label htmlFor="search" className={filterStyles.label}>
            Buscar por título
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="search"
              name="search"
              type="text"
              className={`${filterStyles.input} pl-10`}
              placeholder="Buscar imóvel"
              value={filters.search}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Tipo de Leilão */}
        <div>
          <label htmlFor="type" className={filterStyles.label}>
            Tipo de Leilão
          </label>
          <select
            id="type"
            name="type"
            className={filterStyles.select}
            value={filters.type}
            onChange={handleChange}
          >
            <option value="">Todos os tipos</option>
            <option value="judicial">Judicial</option>
            <option value="extrajudicial">Extrajudicial</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className={filterStyles.label}>
            Status
          </label>
          <select
            id="status"
            name="status"
            className={filterStyles.select}
            value={filters.status}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            <option value="active">Ativo</option>
            <option value="ended">Finalizado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        {/* Apenas Favoritos */}
        <div className="flex items-end">
          <div className="flex items-center h-10">
            <input
              id="isFavorite"
              name="isFavorite"
              type="checkbox"
              className="h-4 w-4 text-[#C0A000] focus:ring-[#C0A000] rounded"
              checked={filters.isFavorite}
              onChange={handleChange}
            />
            <label htmlFor="isFavorite" className="ml-2 block text-[#333333] text-sm">
              Apenas favoritos
            </label>
          </div>
        </div>
      </div>

      {/* Filtros Avançados */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
          {/* Preço Mínimo */}
          <div>
            <label htmlFor="minPrice" className={filterStyles.label}>
              Preço Mínimo
            </label>
            <input
              id="minPrice"
              name="minPrice"
              type="number"
              className={filterStyles.input}
              placeholder="R$ 0,00"
              value={filters.minPrice}
              onChange={handleChange}
            />
          </div>

          {/* Preço Máximo */}
          <div>
            <label htmlFor="maxPrice" className={filterStyles.label}>
              Preço Máximo
            </label>
            <input
              id="maxPrice"
              name="maxPrice"
              type="number"
              className={filterStyles.input}
              placeholder="R$ 0,00"
              value={filters.maxPrice}
              onChange={handleChange}
            />
          </div>

          {/* Área Mínima */}
          <div>
            <label htmlFor="minArea" className={filterStyles.label}>
              Área Mínima (m²)
            </label>
            <input
              id="minArea"
              name="minArea"
              type="number"
              className={filterStyles.input}
              placeholder="0 m²"
              value={filters.minArea}
              onChange={handleChange}
            />
          </div>

          {/* Área Máxima */}
          <div>
            <label htmlFor="maxArea" className={filterStyles.label}>
              Área Máxima (m²)
            </label>
            <input
              id="maxArea"
              name="maxArea"
              type="number"
              className={filterStyles.input}
              placeholder="0 m²"
              value={filters.maxArea}
              onChange={handleChange}
            />
          </div>

          {/* Quartos */}
          <div>
            <label htmlFor="bedrooms" className={filterStyles.label}>
              Quartos
            </label>
            <select
              id="bedrooms"
              name="bedrooms"
              className={filterStyles.select}
              value={filters.bedrooms}
              onChange={handleChange}
            >
              <option value="">Qualquer</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          {/* Banheiros */}
          <div>
            <label htmlFor="bathrooms" className={filterStyles.label}>
              Banheiros
            </label>
            <select
              id="bathrooms"
              name="bathrooms"
              className={filterStyles.select}
              value={filters.bathrooms}
              onChange={handleChange}
            >
              <option value="">Qualquer</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          {/* Vagas */}
          <div>
            <label htmlFor="parkingSpots" className={filterStyles.label}>
              Vagas
            </label>
            <select
              id="parkingSpots"
              name="parkingSpots"
              className={filterStyles.select}
              value={filters.parkingSpots}
              onChange={handleChange}
            >
              <option value="">Qualquer</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={filterStyles.button.advanced}
        >
          {showAdvanced ? 'Menos Filtros' : 'Mais Filtros'}
        </button>
        
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={onClearFilters}
            className={filterStyles.button.clear}
          >
            <FaTimes className="inline mr-1" /> Limpar Filtros
          </button>
        </div>
      </div>
    </div>
  )
} 