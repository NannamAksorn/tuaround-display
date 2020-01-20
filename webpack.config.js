// webpack.config.js
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');

module.exports = {
  devServer:{
    disableHostCheck: true,
    proxy:{
      '/api': {
        target: {
          host: "0.0.0.0",
          protocol: 'http',
          port: 8081
        },
        pathRewriite: {
          '^/api':  ''
        }
      },
      '/socket.io': {
        target: 'ws://localhost:3000',
        ws: true
      }
    },
    contentBase: path.join(__dirname, 'dist'),
  },
  devtool: '',
  entry: [
    './src/index.js',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
    pathinfo: false,
  },
  watch: false,
  module: {
    rules: [
      // html
      {
        test: /\.html$/,
        loader: "raw-loader"
      },
      // js
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src/js')
        ],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      // css
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      // css for node_modules
      // { test: /\.css$/,
      //   loader: 'style-loader!css-loader',
      //   // exclude: path.resolve(__dirname, 'src/css')

      // },
      {
        test: /\.(png|svg|jpg|gif)$/,
        // include: [
        //   path.resolve(__dirname, 'public')
        // ],
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
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
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
