import React from 'react'

const ChatMessages = ({ messages, messagesEndRef }) => {
  return (
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
  )
}

export default ChatMessages