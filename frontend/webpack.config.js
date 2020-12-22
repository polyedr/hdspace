const webpack = require('webpack');
const path = require('path');
const safePostCssParser = require('postcss-safe-parser');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // uncomment to pretty view modules size
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = ({ MODE }) => {
  const isProduction = MODE === 'production';
  return {
    context: __dirname,
    mode: MODE || 'development',
    bail: isProduction,
    devtool: !isProduction ? 'cheap-module-source-map' : false,
    entry: {
      app: path.resolve(__dirname, 'src', 'index.tsx'),
    },
    output: {
      path: path.join(__dirname, './dist'),
      filename: 'bundle.js',
      chunkFilename: '[chunkhash].js',
      publicPath: '/',
    },
    target: 'web',
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      // Fix webpack's default behavior to not load packages with jsnext:main module
      // (jsnext:main directs not usually distributable es6 format, but es6 sources)
      mainFields: ['module', 'browser', 'main'],
      alias: {
        '@Components': path.resolve(__dirname, 'src', 'components'),
        '@Constants': path.resolve(__dirname, 'src', 'constants'),
        '@Utils': path.resolve(__dirname, 'src', 'utils'),
        '@Redux': path.resolve(__dirname, 'src', 'redux'),
        '@Api': path.resolve(__dirname, 'src', 'api'),
        '@Types': path.resolve(__dirname, 'src', 'types'),
        '@Domain': path.resolve(__dirname, 'src', 'domain'),
        '@Src': path.resolve(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            isProduction && {
              loader: 'babel-loader',
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                configFile: 'tsconfig.json',
              },
            },
          ].filter(Boolean),
        },
        // css
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  ident: 'postcss',
                  plugins: [
                    'postcss-import',
                    'postcss-url',
                    'postcss-preset-env',
                    'postcss-reporter',
                    { 'postcss-browser-reporter': { disabled: isProduction } },
                  ],
                },
              },
            },
          ],
        },
        // static assets
        /* { test: /\.html$/, use: 'html-loader' }, */
        { test: /\.(png|svg|jpg|gif)$/, use: 'file-loader' },
        {
          test: /\.scss$/,
          use: [
            {
              loader: isProduction
                ? MiniCssExtractPlugin.loader
                : 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: !isProduction,
                importLoaders: 2,
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
            },
            { loader: 'sass-loader', options: {} },
            {
              loader: 'sass-resources-loader',
              options: {
                includePaths: ['src', 'node_modules', '.'],
                resources: [
                  path.resolve(__dirname, 'src', 'styles', 'variables.scss'),
                ],
              },
            },
          ],
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
      ],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            // Added for profiling in devtools
            keep_classnames: false,
            keep_fnames: false,
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
        }),
        // This is only used in production mode
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: false,
          },
          cssProcessorPluginOptions: {
            preset: ['default', { minifyFontValues: { removeQuotes: false } }],
          },
        }),
      ],
      splitChunks: {
        chunks: 'async',
        minSize: 20000,
        minRemainingSize: 0,
        minChunks: 2,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        automaticNameDelimiter: '~',
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: MODE || 'development', // use 'development' unless process.env.NODE_ENV is defined
        DEBUG: false,
      }),
      new MiniCssExtractPlugin({
        filename: '[contenthash].css',
        disable: !isProduction,
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
        hash: false,
        favicon: './src/assets/sprites/favicon.png',
        ...(isProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : {}),
      }),
      new ForkTsCheckerWebpackPlugin(),
      // new BundleAnalyzerPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/styles/export/material/mdc.checkbox.css',
            to: 'styles/material',
            toType: 'dir',
          },
          {
            from: 'src/styles/export/material/mdc.radio.css',
            to: 'styles/material',
            toType: 'dir',
          },
          {
            from: 'src/styles/export/material/mdc.select.css',
            to: 'styles/material',
            toType: 'dir',
          },
          {
            from: 'src/export/js/app.js',
            to: 'js/export',
          },
          {
            from: 'node_modules/@material/form-field/dist/mdc.form-field.css',
            to: 'styles/material',
            toType: 'dir',
          },
          {
            from: 'node_modules/@material/list/dist/mdc.list.css',
            to: 'styles/material',
            toType: 'dir',
          },
          {
            from:
              'node_modules/@material/menu-surface/dist/mdc.menu-surface.css',
            to: 'styles/material',
            toType: 'dir',
          },
          {
            from: 'node_modules/@material/menu/dist/mdc.menu.css',
            to: 'styles/material',
            toType: 'dir',
          },
        ],
        options: {
          concurrency: 10,
        },
      }),
    ],

    devServer: {
      port: 8080,
      hot: true,
      inline: true,
      contentBase: 'dist',
      publicPath: '/',
      historyApiFallback: {
        disableDotRule: true,
      },
      stats: 'minimal',
    },
  };
};
