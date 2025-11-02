const express = require('express');
const HttpController = require('../controllers/HttpController');

const router = express.Router();

let httpController;

function initializeRoutes(controller) {
  httpController = controller;
  
  router.get('/health', httpController.healthCheck.bind(httpController));
  router.get('/api/info', httpController.serverInfo.bind(httpController));
  
  return router;
}

module.exports = initializeRoutes;