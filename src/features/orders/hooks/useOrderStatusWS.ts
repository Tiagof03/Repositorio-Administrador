import { useEffect, useRef, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import useAuthStore from '@/store/useAuthStore'
import useWsStore from '@/store/wsStore'

function getWsBaseUrl(): string {
  const override = import.meta.env.VITE_WS_URL
  if (override) return override.replace(/\/$/, '')
  const apiUrl: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'
  return apiUrl
    .replace(/^http/, 'ws')
    .replace(/\/$/, '')
}

export function useOrderStatusWS() {
  const queryClient = useQueryClient()
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const token = useAuthStore((s) => s.token)
  const { setStatus, setLastEvent, incrementReconnect, resetReconnect, reconnectAttempts } = useWsStore()
  const reconnectAttemptsRef = useRef(reconnectAttempts)
  reconnectAttemptsRef.current = reconnectAttempts

  const connect = useCallback(() => {
    if (!token) return

    const baseUrl = getWsBaseUrl()
    const wsUrl = `${baseUrl}/pedidos/ws?token=${token}`
    setStatus('connecting')

    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      setStatus('connected')
      resetReconnect()
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastEvent(data.event ?? 'unknown')
        if (data.event) {
          void queryClient.invalidateQueries({ queryKey: ['orders'] })
        }
      } catch {
        // ignore non-JSON messages
      }
    }

    ws.onclose = () => {
      setStatus('disconnected')
      wsRef.current = null
      incrementReconnect()
      const attempts = reconnectAttemptsRef.current + 1
      const delay = Math.min(1000 * Math.pow(2, attempts), 30000)
      reconnectTimerRef.current = setTimeout(() => connect(), delay)
    }

    ws.onerror = () => {
      ws.close()
    }
  }, [token, setStatus, setLastEvent, incrementReconnect, resetReconnect, queryClient])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [connect])

  return useWsStore
}
