import { useState, useRef } from 'react';

const useChat = (socket, sendMessage) => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [userListPosition, setUserListPosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef(null);

  const handleSetUsername = () => {
    if (username.trim() && socket && socket.readyState === WebSocket.OPEN) {
      sendMessage({
        type: 'setUsername',
        newUsername: username
      });
    }
  };

  const insertUsername = (selectedUser, users, setUsers) => {
    const input = inputRef.current;
    if (input) {
      const startPos = message.lastIndexOf('@', input.selectionStart);
      const endPos = input.selectionStart;
      const newMessage = message.substring(0, startPos) + `@${selectedUser.username} ` + message.substring(endPos);
      setMessage(newMessage);
      setShowUserList(false);
    }
  };

  const handleInputChange = (e, users, setUsers) => {
    const value = e.target.value;
    setMessage(value);
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      sendMessage({
        type: 'getUserList'
      });
    }
    
    const input = e.target;
    const caretPosition = input.selectionStart;
    
    if (value.charAt(caretPosition - 1) === '@' && users.length > 0) {
      const rect = input.getBoundingClientRect();
      setUserListPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
      setShowUserList(true);
    } else if (showUserList && !value.includes('@')) {
      setShowUserList(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (showUserList && (e.key === 'Escape' || e.key === 'Tab')) {
      setShowUserList(false);
      e.preventDefault();
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (message.trim() && socket && socket.readyState === WebSocket.OPEN) {
      sendMessage({
        type: 'chat',
        username: username || 'Anonymous',
        message: message
      });
      
      setMessage('');
      setShowUserList(false);
    }
  };

  return {
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
  };
};

export default useChat;