const path = require('path');
const webpack = require('webpack');
const postCSSConfig = require('./postcss.config');

const customPath = path.join(__dirname, './customPublicPath');

module.exports = {
  entry: {
    main: [customPath, path.join(__dirname, '../chrome/extension/main')],
    background: [customPath, path.join(__dirname, '../chrome/extension/background')],
    content: [customPath, path.join(__dirname, '../chrome/extension/content')],
    inject: [customPath, path.join(__dirname, '../chrome/extension/inject')],
    popup: [customPath, path.join(__dirname, '../chrome/extension/popup')],
  },
  output: {
    path: path.join(__dirname, '../build/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  postcss() {
    return postCSSConfig;
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compressor: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['react-optimize']
      }
    }, {
      test: /\.css$/,
      loaders: [
        'style',
        'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        'postcss'
      ]
    }]
  }
};
