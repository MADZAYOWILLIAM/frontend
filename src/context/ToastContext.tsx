import { createContext, useContext } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({
  showToast: (message) => {
    console.info(message)
  },
})

export const useToast = () => useContext(ToastContext)
