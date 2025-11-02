import React, { forwardRef } from 'react'

const ChatInput = forwardRef(({ 
  message, 
  setMessage, 
  handleInputChange, 
  handleInputKeyDown, 
  handleSendMessage, 
  connected 
}, ref) => {
  return (
    <form className="chat-form" onSubmit={handleSendMessage}>
      <input
        ref={ref}
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
  )
})

export default ChatInput