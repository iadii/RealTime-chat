import React from 'react'

const ChatHeader = ({ username, setUsername, handleSetUsername }) => {
  return (
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
  )
}

export default ChatHeader