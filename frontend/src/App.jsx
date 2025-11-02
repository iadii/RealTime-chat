import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import ChatHeader from './components/ChatHeader'
import ChatMessages from './components/ChatMessages'
import ChatInput from './components/ChatInput'
import UserList from './components/UserList'
import ConnectionStatus from './components/ConnectionStatus'
import useWebSocket from './hooks/useWebSocket'
import useChat from './hooks/useChat'

function App() {
  const messagesEndRef = useRef(null)
  
  const {
    socket,
    connected,
    messages,
    users,
    sendMessage
  } = useWebSocket('ws://localhost:9002')

  const {
    username,
    setUsername,
    message,
    setMessage,
    showUserList,
    setShowUserList,
    userListPosition,
    setUserListPosition,
    inputRef,
    handleSetUsername,
    insertUsername,
    handleInputChange,
    handleInputKeyDown,
    handleSendMessage
  } = useChat(socket, sendMessage)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Scroll to bottom when messages change
  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="App">
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
          message={message}
          setMessage={setMessage}
          handleInputChange={(e) => handleInputChange(e, users)}
          handleInputKeyDown={handleInputKeyDown}
          handleSendMessage={handleSendMessage}
          connected={connected}
          inputRef={inputRef}
        />
        
        <UserList
          showUserList={showUserList}
          userListPosition={userListPosition}
          users={users}
          insertUsername={(user) => insertUsername(user, users)}
          setShowUserList={setShowUserList}
        />
        
        <ConnectionStatus connected={connected} />
      </div>
    </div>
  )
}

export default App