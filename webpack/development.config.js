const path = require('path');

module.exports = require('./webpack.base.config')({
  devtool: 'source-map',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '../lib'),
  },
  module: {
    rules: [],
  },
  mode: 'development',
});
