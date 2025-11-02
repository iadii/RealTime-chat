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

// Handle port in use errors gracefully
function startServer(port) {
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ noServer: true });
  
  wss.on('connection', (ws, req) => {
    webSocketController.handleConnection(ws, req);
  });

  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  server.listen(port, serverConfig.host, () => {
    logger.info(`Server is listening on port ${port}`);
    logger.info(`WebSocket server is ready`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      logger.warn(`Port ${port} is already in use. Trying ${port + 1}...`);
      setTimeout(() => {
        startServer(port + 1);
      }, 1000);
    } else {
      logger.error('Server error:', error);
    }
  });
}

// Start the server with the configured port
startServer(serverConfig.port);