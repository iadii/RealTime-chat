import { useState, useEffect } from 'react'

const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const newSocket = new WebSocket(url)
    
    newSocket.onopen = () => {
      console.log('Connected to server')
      setSocket(newSocket)
      setConnected(true)
    }

    newSocket.onclose = () => {
      console.log('Disconnected from server')
      setConnected(false)
    }

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => {
      newSocket.close()
    }
  }, [url])

  return { socket, connected }
}

export default useWebSocket