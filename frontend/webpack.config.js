const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

const { join } = path;
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
  title: 'Editor',
  hash: false,
  favicon: './src/assets/sprites/favicon.png',
});

const miniCssExractPlugin = new MiniCssExtractPlugin({
  filename: '[name].css',
  chunkFilename: '[id].css',
});

const isDevelopment = process.env.NODE_ENV !== 'production';
const devtool = isDevelopment ? 'eval-cheap-module-source-map' : undefined;

const resolve = {
  alias: {
    'react-dom': '@hot-loader/react-dom',
    $components: join(__dirname, 'src/components'),
    $containers: join(__dirname, 'src/containers'),
    $features: join(__dirname, 'src/features'),
    $constants: join(__dirname, 'src/constants'),
    $assets: join(__dirname, 'src/assets'),
    $config: join(__dirname, './config'),
    $styles: join(__dirname, 'src/styles'),
    $redux: join(__dirname, 'src/redux'),
    $utils: join(__dirname, 'src/utils'),
    $test: join(__dirname, 'test'),
    $api: join(__dirname, 'src/api'),
    $shared: join(__dirname, 'src/shared'),
    $domain: join(__dirname, 'src/domain'),
  },
  extensions: ['*', '.ts', '.tsx', '.js', '.jsx', '.json'],
};

/* Configuration */

module.exports = () => {
  /* Export */
  const plugins = [
    htmlPlugin,
    miniCssExractPlugin,
    new webpack.HashedModuleIdsPlugin(),
  ];

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: isDevelopment
                ? 'style-loader'
                : MiniCssExtractPlugin.loader,
            },
            // { loader: 'css-loader' },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: isDevelopment,
                importLoaders: 2,
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
            },
            { loader: 'less-loader' },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: isDevelopment
                ? 'style-loader'
                : MiniCssExtractPlugin.loader,
            },
            // { loader: 'css-loader' },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: isDevelopment,
                importLoaders: 2,
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
            },
            { loader: 'sass-loader' },
            {
              loader: 'sass-resources-loader',
              options: {
                resources: ['src/styles/variables.scss'],
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.(ts|tsx)?$/,
          loader: 'awesome-typescript-loader',
          options: { transpileOnly: !isDevelopment },
        },
        {
          test: /\.(eot|ttf|woff|woff2|otf|svg)$/,
          include: [/fonts/],
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        },
        {
          test: /\.(png|svg)$/,
          exclude: [/fonts/],
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        },
      ],
    },
    devtool,
    resolve,
    plugins,
    entry: {
      app: './src/index.tsx',
    },
    output: {
      publicPath: '/',
      filename: isDevelopment ? '[name].[hash].js' : '[name].[contenthash].js',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2,
            minSize: 0,
            reuseExistingChunk: true,
          },
        },
      },
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: isDevelopment,
          sourceMap: isDevelopment, // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
      // To keep filename consistent between different modes (for example building only)
      occurrenceOrder: true,
    },
    devServer: {
      port: 8080,
      // host: '192.168.0.108',
      hot: true,
      contentBase: 'dist',
      publicPath: '/',
      historyApiFallback: true,
    },
  };
};
