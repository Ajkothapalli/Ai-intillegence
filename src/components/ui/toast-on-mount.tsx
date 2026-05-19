'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

interface Props {
  message: string
  type?: 'success' | 'info' | 'error'
}

export function ToastOnMount({ message, type = 'success' }: Props) {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    if (type === 'success') toast.success(message)
    else if (type === 'info') toast.info(message)
    else toast.error(message)
  }, [message, type])
  return null
}
