const path = require('path');

module.exports = require('./webpack.base.config')({
  devtool: false,
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '../lib'),
  },
  module: {
    rules: [],
  },
  mode: 'production',
});
