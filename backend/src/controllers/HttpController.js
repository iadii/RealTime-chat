class HttpController {
  constructor(webSocketController) {
    this.webSocketController = webSocketController;
  }

  healthCheck(req, res) {
    const clients = this.webSocketController.getChatModel().getAllClients();
    res.status(200).json({ status: 'OK', clients: clients.size });
  }

  serverInfo(req, res) {
    const clients = this.webSocketController.getChatModel().getAllClients();
    res.status(200).json({ 
      status: 'OK', 
      clients: clients.size,
      uptime: process.uptime()
    });
  }
}

module.exports = HttpController;