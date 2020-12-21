const path = require('path');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    polyfill: 'babel-polyfill',
    app: './js/app.js',
  },

  context: path.resolve(__dirname, 'src'),

  devServer: {
    publicPath: '/',
    port: 9000,
    contentBase: path.join(process.cwd(), 'dist'),
    host: 'localhost',
    historyApiFallback: true,
    noInfo: false,
    stats: 'minimal',
    hot: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',

            options: {
              importLoaders: 1,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [precss, autoprefixer],
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: './styles.[hash].css'
    }),
  ],

  resolve: {
    extensions: ['.js', '.css'],
    alias: {
      '@': path.resolve(__dirname, './src/js'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial",
        }
      }
    }
  },

  mode: 'development',
};
