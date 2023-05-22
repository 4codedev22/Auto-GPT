const path = require("path");
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');




const lazyImports =
  [
    '@nestjs/microservices',
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
    'cache-manager',
    'class-transformer',
    'class-validator',
    'fastify-static',
    'typeorm/platform',
    'fastify-swagger',
    'bufferutil',
    'cardinal',
    'mongodb',
    '@sap/hana-client',
    'mysql',
    'oracledb',
    'hdb-pool',
    'pg',
    'pg-native',
    'pg-query-stream',
    'typeorm-aurora-data-api-driver',
    'redis',
    'ioredis',
    'better-sqlite3',
    'sqlite3',
    'sql.js',
    'mssql',
    'react-native-sqlite-storage',
    'utf-8-validate'
  ];
const WebPackIgnorePlugin =
{
  checkResource: function (resource) {
    if (!lazyImports.includes(resource))
      return false;

    try {
      require.resolve(resource);
    }
    catch (err) {
      return true;
    }

    return false;
  }
};

module.exports =
{
  mode: 'production',
  target: 'node',
  devtool: 'source-map',
  entry:
  {
    server: './src/main.ts',
  },
  module:
  {
    rules:
      [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
  },
  resolve:
  {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      'handlebars': 'handlebars/dist/handlebars.js',
      'puppeteer-core': 'puppeteer-core/lib/cjs/puppeteer/puppeteer-core.js'
    }
  },
  node: {
    __dirname: false
  },
  plugins:
    [
      new CleanWebpackPlugin(),
      new webpack.IgnorePlugin(WebPackIgnorePlugin),
      new CopyWebpackPlugin({
        patterns: [
          './node_modules/swagger-ui-express/indexTemplate.html.tpl',
          './node_modules/swagger-ui-express/swagger-ui-init.js.tpl',
          './node_modules/swagger-ui-dist/swagger-ui.css',
          './node_modules/swagger-ui-dist/swagger-ui-bundle.js',
          './node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
          './node_modules/swagger-ui-dist/favicon-16x16.png',
          './node_modules/swagger-ui-dist/favicon-32x32.png'
        ]
      })
    ],
  optimization:
  {
    minimizer: [new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        mangle: true,
        keep_fnames: true
      }
    })]
  },
  performance:
  {
    maxEntrypointSize: 1000000000,
    maxAssetSize: 1000000000
  },
  output:
  {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};