import React from 'react';

const ChatInput = ({ 
  message, 
  setMessage, 
  handleInputChange, 
  handleInputKeyDown, 
  handleSendMessage,
  connected,
  inputRef
}) => {
  return (
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
  );
};

export default ChatInput;