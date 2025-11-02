const ChatModel = require('../models/ChatModel');

class WebSocketController {
  constructor() {
    this.chatModel = new ChatModel();
  }

  handleConnection(ws, req) {
    const clientId = Date.now() + Math.random();
    this.chatModel.addClient(clientId, ws);
    this.chatModel.setUserName(clientId, 'Anonymous');
    
    console.log(`Client ${clientId} connected from ${req.socket.remoteAddress}`);
    
    this.sendToClient(ws, {
      type: 'info',
      message: 'Welcome to the chat!'
    });
    
    // Notify others about new user
    this.broadcast({
      type: 'join',
      id: clientId,
      username: 'Anonymous',
      message: `Anonymous has joined the chat`
    }, clientId);
    
    ws.on('message', (data) => this.handleMessage(clientId, ws, data));
    
    ws.on('close', () => this.handleDisconnect(clientId));
    
    ws.on('error', (error) => this.handleError(clientId, error));
    
    return clientId;
  }
  
  handleMessage(clientId, ws, data) {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'chat':
          this.handleChatMessage(clientId, message);
          break;
          
        case 'setUsername':
          const oldUsername = this.chatModel.getUserName(clientId);
          const newUsername = message.newUsername || 'Anonymous';
          this.chatModel.setUserName(clientId, newUsername);
          
          this.broadcast({
            type: 'username',
            id: clientId,
            oldUsername: oldUsername,
            newUsername: newUsername
          });
          
          // Send updated user list
          this.sendUserList(ws, clientId);
          break;
          
        case 'getUserList':
          this.sendUserList(ws, clientId);
          break;
      }
    } catch (error) {
      console.error('Error parsing message:', error);
      this.sendToClient(ws, {
        type: 'error',
        message: 'Error processing message'
      });
    }
  }
  
  handleChatMessage(clientId, messageData) {
    const username = this.chatModel.getUserName(clientId);
    const chatMessage = {
      type: 'chat',
      id: clientId,
      username: username,
      message: messageData.message,
      timestamp: new Date().toISOString()
    };
    
    console.log('Broadcasting chat message:', chatMessage); // Debug log
    this.broadcast(chatMessage);
  }
  
  handleDisconnect(clientId) {
    const username = this.chatModel.getUserName(clientId);
    this.chatModel.removeClient(clientId);
    console.log(`Client ${clientId} disconnected`);
    
    this.broadcast({
      type: 'leave',
      id: clientId,
      username: username,
      message: `${username} has left the chat`
    });
  }
  
  handleError(clientId, error) {
    console.error(`WebSocket error for client ${clientId}:`, error);
    this.chatModel.removeClient(clientId);
  }
  
  broadcast(message, excludeId = null) {
    const clients = this.chatModel.getAllClients();
    console.log(`Broadcasting message to ${clients.size} clients, excluding ${excludeId}`); // Debug log
    clients.forEach((client, id) => {
      if (client.readyState === 1 && id !== excludeId) { // 1 = OPEN
        this.sendToClient(client, message);
      }
    });
  }
  
  sendToClient(client, message) {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(JSON.stringify(message));
    }
  }
  
  sendUserList(client, excludeId) {
    const userList = this.chatModel.getUserList(excludeId);
    this.sendToClient(client, {
      type: 'userList',
      users: userList
    });
  }
  
  getChatModel() {
    return this.chatModel;
  }
}

module.exports = WebSocketController;