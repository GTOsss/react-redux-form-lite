const webpack = require('webpack');
const path = require('path');
const configResolve = require('./resolve');

const defainePlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
});

module.exports = options => ({
  devtool: options.devtool,
  entry: [path.join(__dirname, '../src/index.ts')],
  output: options.output,
  module: {
    rules: [
      ...options.module.rules,
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      },
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
    ],
  },
  plugins: [
    defainePlugin,
  ],
  resolve: configResolve.resolve,
  mode: options.mode,
});
