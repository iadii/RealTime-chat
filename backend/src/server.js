const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const corsMiddleware = require('./middleware/corsMiddleware');
const initializeRoutes = require('./routes');
const WebSocketController = require('./controllers/WebSocketController');
const HttpController = require('./controllers/HttpController');
const serverConfig = require('./config/serverConfig');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);

app.use(corsMiddleware);
app.use(express.json());

if (serverConfig.isProduction) {
  app.use(express.static(serverConfig.staticPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(serverConfig.staticPath, 'index.html'));
  });
}

const webSocketController = new WebSocketController();
const httpController = new HttpController(webSocketController);
const router = initializeRoutes(httpController);

app.use(router);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  webSocketController.handleConnection(ws, req);
});

server.listen(serverConfig.port, serverConfig.host, () => {
  logger.info(`Server is listening on port ${serverConfig.port}`);
  logger.info(`WebSocket server is ready`);
});
