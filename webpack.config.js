const devConfig = require('./webpack/development.config');
const prodConfig = require('./webpack/production.config');

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

module.exports = config;