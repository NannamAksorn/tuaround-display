const CompressionPlugin = require('compression-webpack-plugin')
// webpack.config.js
const path = require('path')

module.exports = {
  devtool: '',
  entry: [
    './src/index.js',
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      // js
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "src/js")
        ],
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      // css
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, "src/css")
        ],
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      // css for node_modules
      { test: /\.css$/,
        loader: "style-loader!css-loader",
        exclude: path.resolve(__dirname, 'src/css')

      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
            loader: 'file-loader',
            options: {
                name:'img/[name]_[hash:7].[ext]',
            }
        }]
      }
    ]
  },
  resolve: {
    modules: ['node_modules']
  },
  plugins: [
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new CompressionPlugin({
      filename: '[path].br[query]',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
};