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

interface ApiMessage {
  message: string
  path?: string
}

interface ApiError {
  message?: any
  response?: { data?: any }
  status?: number
}

export const handleErrorApi = <T extends Record<string, unknown>>({
  error,
  setError,
  duration,
  showToastForFieldError = false
}: {
  error: ApiError | any
  setError?: UseFormSetError<T>
  duration?: number
  showToastForFieldError?: boolean
}) => {
  const data =
    error?.response?.data || // Axios
    error?.message || // Redux rejectWithValue
    error // fallback

  const messages: ApiMessage[] = Array.isArray(data?.message)
    ? data.message
    : [{ message: data?.error || 'Đã xảy ra lỗi!' }]

  messages.forEach((item) => {
    const field = item.path || 'root'
    let msg = item.message || 'Đã xảy ra lỗi!'

    // Xử lý prefix
    if (msg.startsWith('Error.')) {
      msg = msg.replace(/^Error\./, '')
    }

    // Nếu có field cụ thể
    if (field !== 'root' && setError) {
      setError(field as Path<T>, { type: 'server', message: msg })

      // Nếu bạn vẫn muốn hiển thị toast cho field error
      if (showToastForFieldError) {
        toast.error(msg, { duration: duration ?? 5000 })
      }
    } else {
      // Nếu không có field hoặc không có setError
      toast.error(msg, { duration: duration ?? 5000 })
    }
  })
}

const now = new Date()
export const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
