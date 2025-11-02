import { useState, useEffect, useRef } from 'react';

const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let newSocket;
    
    const connect = () => {
      // Clear any existing socket before creating a new one
      if (newSocket) {
        newSocket.close();
      }
      
      newSocket = new WebSocket(url);
      
      newSocket.onopen = () => {
        console.log('Connected to server');
        setSocket(newSocket);
        setConnected(true);
      };

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleIncomingMessage(data);
      };

      newSocket.onclose = (event) => {
        console.log('Disconnected from server', event);
        setConnected(false);
        
        // Try to reconnect after 3 seconds
        if (!event.wasClean) {
          setTimeout(connect, 3000);
        }
      };

      newSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Close the socket to trigger reconnect
        newSocket.close();
      };
    };
    
    connect();

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [url]);

  const handleIncomingMessage = (data) => {
    console.log('Received message:', data); 
    switch (data.type) {
      case 'info':
        setMessages(prev => {
          // Check if message already exists
          const exists = prev.some(msg => msg.type === 'info' && msg.message === data.message);
          if (exists) return prev;
          return [...prev, {
            id: Date.now() + Math.random(),
            type: 'info',
            message: data.message
          }];
        });
        break
        
      case 'join':
        setMessages(prev => {
          // Check if message already exists
          const exists = prev.some(msg => msg.type === 'join' && msg.username === data.username);
          if (exists) return prev;
          return [...prev, {
            id: Date.now() + Math.random(),
            type: 'join',
            username: data.username,
            message: data.message
          }];
        });
        break
        
      case 'leave':
        setMessages(prev => {
          // Check if message already exists
          const exists = prev.some(msg => msg.type === 'leave' && msg.username === data.username);
          if (exists) return prev;
          return [...prev, {
            id: Date.now() + Math.random(),
            type: 'leave',
            username: data.username,
            message: data.message
          }];
        });
        break
        
      case 'chat':
        setMessages(prev => {
          // Check if message already exists
          const exists = prev.some(msg => 
            msg.type === 'chat' && 
            msg.username === data.username && 
            msg.message === data.message &&
            Math.abs(new Date(msg.timestamp) - new Date(data.timestamp)) < 1000 // Within 1 second
          );
          if (exists) return prev;
          return [...prev, {
            id: Date.now() + Math.random(),
            type: 'chat',
            username: data.username,
            message: data.message,
            timestamp: new Date(data.timestamp)
          }];
        });
        break
        
      case 'username':
        setMessages(prev => {
          // Check if message already exists
          const exists = prev.some(msg => 
            msg.type === 'username' && 
            msg.message === `${data.oldUsername} is now ${data.newUsername}`
          );
          if (exists) return prev;
          return [...prev, {
            id: Date.now() + Math.random(),
            type: 'username',
            message: `${data.oldUsername} is now ${data.newUsername}`
          }];
        });
        break
        
      case 'userList':
        setUsers(data.users)
        break
    }
  }

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  return {
    socket,
    connected,
    messages,
    setMessages,
    users,
    setUsers,
    sendMessage
  };
};

export default useWebSocket;