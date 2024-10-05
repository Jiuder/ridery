require('dotenv').config();

const CONFIG = {};

CONFIG.app = process.env.APP || 'dev';
CONFIG.port = process.env.PORT || '3000';

CONFIG.url = process.env.ENV_URL || 'url';
CONFIG.jwtEncryption = process.env.JWT_ENCRYPTION || 'jwt_please_change';
CONFIG.jwtExpiration = process.env.JWT_EXPIRATION || '10000';
CONFIG.uri = process.env.URI;

CONFIG.URL_DOMAIN = process.env.URL_DOMAIN || '';

module.exports = CONFIG;
