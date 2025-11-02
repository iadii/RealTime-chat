import React, { useState, useEffect, useRef } from 'react'
import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import ConnectionStatus from './ConnectionStatus'
import UserList from './UserList'
import useWebSocket from '../hooks/useWebSocket'

const ChatContainer = () => {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [showUserList, setShowUserList] = useState(false)
  const [userListPosition, setUserListPosition] = useState({ top: 0, left: 0 })
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const { socket, connected } = useWebSocket('ws://localhost:9001')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!socket) return

    const handleMessage = (event) => {
      const data = JSON.parse(event.data)
      handleIncomingMessage(data)
    }

    socket.addEventListener('message', handleMessage)

    return () => {
      socket.removeEventListener('message', handleMessage)
    }
  }, [socket])

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
    <div className="chat-container">
      <ChatHeader 
        username={username}
        setUsername={setUsername}
        handleSetUsername={handleSetUsername}
      />
      
      <ChatMessages 
        messages={messages}
        messagesEndRef={messagesEndRef}
      />
      
      <ChatInput
        ref={inputRef}
        message={message}
        setMessage={setMessage}
        handleInputChange={handleInputChange}
        handleInputKeyDown={handleInputKeyDown}
        handleSendMessage={handleSendMessage}
        connected={connected}
      />
      
      {showUserList && (
        <UserList
          users={users}
          insertUsername={insertUsername}
          userListPosition={userListPosition}
        />
      )}
      
      {!connected && <ConnectionStatus />}
    </div>
  )
}

export default ChatContainer