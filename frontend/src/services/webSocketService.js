import logger from '../utils/logger'

class WebSocketService {
  constructor() {
    this.socket = null
    this.listeners = {}
  }

  connect(url) {
    this.socket = new WebSocket(url)
    
    this.socket.onopen = () => {
      logger.info('WebSocket connection opened')
      if (this.listeners.open) {
        this.listeners.open()
      }
    }
    
    this.socket.onmessage = (event) => {
      if (this.listeners.message) {
        this.listeners.message(event)
      }
    }
    
    this.socket.onclose = () => {
      logger.info('WebSocket connection closed')
      if (this.listeners.close) {
        this.listeners.close()
      }
    }
    
    this.socket.onerror = (error) => {
      logger.error('WebSocket error: ' + error)
      if (this.listeners.error) {
        this.listeners.error(error)
      }
    }
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.close()
    }
  }
  
  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data))
    }
  }
  
  on(event, callback) {
    this.listeners[event] = callback
  }
}

export default WebSocketService