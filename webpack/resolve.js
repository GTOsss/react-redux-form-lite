const path = require('path');

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      '@components': path.resolve(__dirname, '../src/components/'),
      '@styles': path.resolve(__dirname, '../src/styles'),
      '@assets': path.resolve(__dirname, '../src/assets'),
      '@services': path.resolve(__dirname, '../src/services/'),
      '@utils': path.resolve(__dirname, '../src/utils/'),
      '@containers': path.resolve(__dirname, '../src/containers'),
      '@store': path.resolve(__dirname, '../src/store'),
      '@blocks': path.resolve(__dirname, '../src/blocks'),
    },
  },
};
