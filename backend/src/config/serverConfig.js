const path = require('path');

const serverConfig = {
  port: process.env.PORT || 8081,
  host: '0.0.0.0',
  isProduction: process.env.NODE_ENV === 'production',
  staticPath: path.join(__dirname, '../../frontend/dist')
};

module.exports = serverConfig;