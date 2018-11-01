const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

const index = new HtmlWebpackPlugin({
  template: path.join(__dirname, '../src/template.html'),
  filename: 'index.html',
});

const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: '../styles/main.css',
  chunkFilename: '[id].css',
});


module.exports = require('./webpack.base.config')({
  devtool: false,
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '../app/public/scripts'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: true,
              importLoaders: 1,
              modules: true,
              localIdentName: '[local]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer({
                  browsers: ['IE 10', 'IE 11', 'last 4 version'],
                  grid: true,
                }),
              ],
              sourceMap: true,
            },
          },
          {
            loader: 'resolve-url-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // new webpack.NoEmitOnErrorsPlugin(),
    // new webpack.optimize.OccurrenceOrderPlugin(),
    miniCssExtractPlugin,
  ],
  mode: 'production',
});
