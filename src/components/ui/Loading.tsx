interface LoadingProps {
  message?: string
}

export default function Loading({ message = 'Carregando...' }: LoadingProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-[#C0A000]"></div>
      <p className="mt-2 text-[#333333] text-sm">{message}</p>
    </div>
  )
} 