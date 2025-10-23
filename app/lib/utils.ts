import { clsx, type ClassValue } from 'clsx'
import type { Path, UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

interface ApiError extends Error {
  response?: {
    data?: {
      errors?: { field: string; message: string }[]
      message?: string
    }
  }
}

export const handleErrorApi = <T extends Record<string, unknown>>({
  error,
  setError,
  duration
}: {
  error: ApiError
  setError: UseFormSetError<T>
  duration?: number
}) => {
  if (error.response?.data?.errors) {
    error.response.data.errors.forEach(({ field, message }) => {
      setError?.(field as Path<T>, {
        type: 'server',
        message
      })
    })
  } else if (error.response?.data?.message) {
    toast.error(error.response.data.message, { duration: duration ?? 5000 })
  } else {
    toast.error('Đã xảy ra lỗi! Vui lòng thử lại sau.', { duration: duration ?? 5000 })
  }
}

const now = new Date()
export const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
