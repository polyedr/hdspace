const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const { join } = path;
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const miniCssExractPlugin = new MiniCssExtractPlugin({
  filename: 'styles.css',
  chunkFilename: '[id].css',
});

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

module.exports = () => {
  const plugins = [
    miniCssExractPlugin,
  ];

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: false,
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
        { test: /\.(ts|tsx)?$/, loader: 'awesome-typescript-loader', 
          options: { transpileOnly: true }},
        {
          test: /\.(eot|ttf|woff|woff2|otf)$/,
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
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        },
      ],
    },
    resolve,
    plugins,
    entry: {
      app: './src/export.tsx',
    },
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'dist/export'),
      filename: 'bundle.js',
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: false,
          sourceMap: true,
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
      occurrenceOrder: true,
    },
  };
};
