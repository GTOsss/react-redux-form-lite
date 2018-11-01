const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const configResolve = require('./resolve');

const defainePlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
});

module.exports = options => ({
  devtool: options.devtool,
  entry: ['@babel/polyfill', path.join(__dirname, '../src/index.js')],
  output: options.output,
  devServer: {
    contentBase: path.join(__dirname, '../public'),
    port: 3000,
    historyApiFallback: true,
  },
  module: {
    rules: [
      ...options.module.rules,
      {
        test: /\.js$|\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        ],
      },
      {
        test: /\.woff2?$|\.ttf$|\.eot$/,
        loader: 'file-loader',
        options: {
          name: '../fonts/[name].[ext]',
        },
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '../images/[name].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: false,
                quality: 65,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...options.plugins,
    defainePlugin,
  ],
  resolve: configResolve.resolve,
  mode: options.mode,
});
