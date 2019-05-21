const webpack = require('webpack');
const path = require('path');

var config = {
  devtool: false,
  output: {
    filename: 'bundle_[hash:10].js',
    path: path.join(__dirname, '../dist'),
  },
  module: {
    rules: [
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
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
  mode: 'production',
};

module.exports = config;
