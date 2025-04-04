import { Fragment, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa'

interface ToastProps {
  show: boolean
  onClose: () => void
  title: string
  message?: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

export default function Toast({
  show,
  onClose,
  title,
  message,
  type = 'success',
  duration = 3000
}: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="h-6 w-6 text-green-400" />
      case 'error':
        return <FaExclamationCircle className="h-6 w-6 text-red-400" />
      case 'info':
        return <FaInfoCircle className="h-6 w-6 text-blue-400" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50'
      case 'error':
        return 'bg-red-50'
      case 'info':
        return 'bg-blue-50'
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-400'
      case 'error':
        return 'border-red-400'
      case 'info':
        return 'border-blue-400'
    }
  }

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition
          show={show}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border ${getBorderColor()} ${getBgColor()} shadow-lg`}>
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getIcon()}
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{title}</p>
                  {message && (
                    <p className="mt-1 text-sm text-gray-500">{message}</p>
                  )}
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fechar</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  )
} 