import React, { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [users, setUsers] = useState([])
  const [showUserList, setShowUserList] = useState(false)
  const [userListPosition, setUserListPosition] = useState({ top: 0, left: 0 })
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8081')
    
    newSocket.onopen = () => {
      console.log('Connected to server')
      setSocket(newSocket)
      setConnected(true)
    }

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      handleIncomingMessage(data)
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
  }, [])

  const handleIncomingMessage = (data) => {
    switch (data.type) {
      case 'info':
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'info',
          message: data.message
        }])
        break
        
      case 'join':
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'join',
          username: data.username,
          message: data.message
        }])
        break
        
      case 'leave':
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'leave',
          username: data.username,
          message: data.message
        }])
        break
        
      case 'chat':
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'chat',
          username: data.username,
          message: data.message,
          timestamp: new Date(data.timestamp)
        }])
        break
        
      case 'username':
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'username',
          message: `${data.oldUsername} is now ${data.newUsername}`
        }])
        break
        
      case 'userList':
        setUsers(data.users)
        break
    }
  }

  const handleSetUsername = () => {
    if (username.trim() && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'setUsername',
        newUsername: username
      }))
    }
  }

  const insertUsername = (selectedUser) => {
    const input = inputRef.current
    if (input) {
      const startPos = message.lastIndexOf('@', input.selectionStart)
      const endPos = input.selectionStart
      const newMessage = message.substring(0, startPos) + `@${selectedUser.username} ` + message.substring(endPos)
      setMessage(newMessage)
      setShowUserList(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setMessage(value)
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'getUserList'
      }))
    }
    
    const input = e.target
    const caretPosition = input.selectionStart
    
    if (value.charAt(caretPosition - 1) === '@' && users.length > 0) {
      const rect = input.getBoundingClientRect()
      setUserListPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      })
      setShowUserList(true)
    } else if (showUserList && !value.includes('@')) {
      setShowUserList(false)
    }
  }

  const handleInputKeyDown = (e) => {
    if (showUserList && (e.key === 'Escape' || e.key === 'Tab')) {
      setShowUserList(false)
      e.preventDefault()
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    
    if (message.trim() && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'chat',
        username: username || 'Anonymous',
        message: message
      }))
      
      setMessage('')
      setShowUserList(false)
    }
  }

  return (
    <div className="App">
      <div className="chat-container">
        <header className="chat-header">
          <h1>Real-Time Chat</h1>
          <div className="username-section">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleSetUsername}>Set Username</button>
          </div>
        </header>
        
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.type}`}>
              {msg.type === 'chat' ? (
                <>
                  <strong>{msg.username}</strong>: {msg.message}
                  <span className="timestamp">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </>
              ) : (
                <em>{msg.message}</em>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form className="chat-form" onSubmit={handleSendMessage}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message... (@ to tag users)"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            disabled={!connected}
          />
          <button type="submit" disabled={!connected || !message.trim()}>
            Send
          </button>
        </form>
        
        {showUserList && (
          <div 
            className="user-list"
            style={{
              position: 'absolute',
              top: `${userListPosition.top}px`,
              left: `${userListPosition.left}px`
            }}
          >
            {users.map(user => (
              <div 
                key={user.id} 
                className="user-list-item"
                onClick={() => insertUsername(user)}
              >
                @{user.username}
              </div>
            ))}
          </div>
        )}
        
        {!connected && (
          <div className="connection-status">
            Connecting to server...
          </div>
        )}
      </div>
    </div>
  )
}

export default App