import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  const getVisiblePageNumbers = () => {
    if (totalPages <= 5) return pageNumbers
    
    if (currentPage <= 3) return pageNumbers.slice(0, 5)
    
    if (currentPage >= totalPages - 2) return pageNumbers.slice(totalPages - 5)
    
    return pageNumbers.slice(currentPage - 3, currentPage + 2)
  }

  const visiblePageNumbers = getVisiblePageNumbers()

  return (
    <div className="flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md focus:outline-none ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-[#002B5B] hover:bg-gray-100'
        }`}
        aria-label="Página anterior"
      >
        <FaChevronLeft className="h-4 w-4" />
      </button>
      
      {currentPage > 3 && totalPages > 5 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 rounded-md text-[#333333] hover:bg-gray-100 focus:outline-none"
          >
            1
          </button>
          {currentPage > 4 && (
            <span className="text-gray-500">...</span>
          )}
        </>
      )}
      
      {visiblePageNumbers.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md focus:outline-none ${
            currentPage === page
              ? 'bg-[#002B5B] text-white font-medium border border-[#C0A000]'
              : 'text-[#333333] hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}
      
      {currentPage < totalPages - 2 && totalPages > 5 && (
        <>
          {currentPage < totalPages - 3 && (
            <span className="text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 rounded-md text-[#333333] hover:bg-gray-100 focus:outline-none"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md focus:outline-none ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-[#002B5B] hover:bg-gray-100'
        }`}
        aria-label="Próxima página"
      >
        <FaChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
} 