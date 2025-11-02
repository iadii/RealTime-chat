class ChatModel {
  constructor() {
    this.clients = new Map();
    this.userNames = new Map();
  }

  addClient(clientId, ws) {
    this.clients.set(clientId, ws);
  }

  removeClient(clientId) {
    this.clients.delete(clientId);
    this.userNames.delete(clientId);
  }

  setUserName(clientId, username) {
    this.userNames.set(clientId, username);
  }

  getUserName(clientId) {
    return this.userNames.get(clientId) || 'Anonymous';
  }

  getAllClients() {
    return this.clients;
  }

  getClient(clientId) {
    return this.clients.get(clientId);
  }

  getAllUserNames() {
    return this.userNames;
  }

  getUserList(excludeId = null) {
    const userList = [];
    this.userNames.forEach((name, id) => {
      if (id !== excludeId) {
        userList.push({ id, username: name });
      }
    });
    return userList;
  }
}

module.exports = ChatModel;