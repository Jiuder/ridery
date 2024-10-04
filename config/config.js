/*
 * Copyright (c) 2021.
 * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 */

require('dotenv').config();

const CONFIG = {}; //Make this global to use all over the application

CONFIG.app = process.env.APP || 'dev';
CONFIG.port = process.env.PORT || '3000';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mysql';
CONFIG.db_host = process.env.DB_HOST || 'localhost';
CONFIG.db_port = process.env.DB_PORT || '3306';
CONFIG.db_name = process.env.DB_NAME || 'name';
CONFIG.db_user = process.env.DB_USER || 'root';
CONFIG.db_password = process.env.DB_PASSWORD || '';
CONFIG.db_charset = process.env.DB_CHARSET || 'utf8mb4';
CONFIG.url = process.env.ENV_URL || 'url';
CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'jwt_please_change';
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '10000';

CONFIG.GID = process.env.GID || '';
CONFIG.GSECRET = process.env.GSECRET || '';
CONFIG.GCALL = process.env.GCAL || '';
CONFIG.GIDApple = process.env.GIDApple || '';

CONFIG.FID = process.env.FID || '';
CONFIG.FSECRET = process.env.FSECRET || '';
CONFIG.FCALL = process.env.FCALL || '';

CONFIG.AID = process.env.AID || '';
CONFIG.ASECRET = process.env.ASECRET || '';
CONFIG.ACALL = process.env.ACALL || '';
CONFIG.AKEYID = process.env.AKEYID || '';

//AMAZON
CONFIG.AWS_SECRET = process.env.AWS_SECRET || '';
CONFIG.AWS_ACCESS = process.env.AWS_ACCESS || '';
CONFIG.AWS_BUCKET = process.env.AWS_BUCKET || '';
CONFIG.AWS_REGION = process.env.AWS_REGION || '';

//STRIPE
CONFIG.P_KEY = process.env.P_KEY || '';
CONFIG.S_KEY = process.env.S_KEY || '';
CONFIG.STRIPE_PERCENT = process.env.STRIPE_PERCENT || 4;
CONFIG.S_HOOK = process.env.S_HOOK || '';
//URL

CONFIG.URL_DOMAIN = process.env.URL_DOMAIN || '';
module.exports = CONFIG;
