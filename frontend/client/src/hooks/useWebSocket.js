import { useEffect, useRef, useCallback } from "react";

import { getToken } from "../utils/jwtUtils";

export function useWebSocket(topic, onMessage) {
  const ws = useRef(null)

  const connect = useCallback(() => {
    const token = getToken()
    const url = `ws://localhost:8080/ws?token=${token}`
    ws.current = new WebSocket(url)

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ type: 'SUBSCRIBE', topic }))
    }

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.topic === topic) onMessage(data.payload)
      } catch {
        // ignore bad messages
      }
    }

    ws.current.onerror = () => {
      setTimeout(connect, 3000)  // retry after 3 seconds
    }
  }, [topic, onMessage])

  useEffect(() => {
    connect()
    return () => ws.current?.close()
  }, [connect])


}