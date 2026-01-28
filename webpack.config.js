const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: path.resolve(__dirname, './src/index.tsx'),

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.module\.css$/i,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.(jpg|jpeg|png|svg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[hash][ext][query]',
          publicPath: '/'
        }
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]'
        }
      }
    ]
  },

  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      title: 'Stellar Burgers',
      favicon: './public/favicon.ico'
    }),
    new Dotenv()
  ],

  resolve: {
    extensions: [
      '*',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
      '.css',
      '.scss',
      '.png',
      '.svg',
      '.jpg'
    ],
    alias: {
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@ui-pages': path.resolve(__dirname, './src/components/ui/pages'),
      '@utils-types': path.resolve(__dirname, './src/utils/types'),
      '@api': path.resolve(__dirname, './src/utils'),
      '@slices': path.resolve(__dirname, './src/services/slices'),
      '@selectors': path.resolve(__dirname, './src/services/selectors'),
      '@services': path.resolve(__dirname, './src/services')
    }
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
    publicPath: '/',
    clean: true
  },

  devServer: {
    static: {
      directory: path.join(__dirname, './dist'),
      publicPath: '/'
    },
    compress: true,
    historyApiFallback: {
      index: '/',
      disableDotRule: true
    },
    port: 4000,
    hot: false,
    open: true,
    proxy: {
      '/api': {
        target: 'https://norma.education-services.ru',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
};
