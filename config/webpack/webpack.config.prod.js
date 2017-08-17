/*
 * @flow
 */

/* eslint-disable import/no-extraneous-dependencies, import/extensions */

import webpack from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';

import APP_CONFIG from '../app/app.config.js';
import APP_PATHS from '../app/paths.config.js';

import baseWebpackConfig from './webpack.config.base.js';

const output = Object.assign({}, baseWebpackConfig.output, {
  filename: `${APP_PATHS.REL.STATIC_JS}/app.[hash:8].js`,
  chunkFilename: `${APP_PATHS.REL.STATIC_JS}/app.chunk.[id].[chunkhash:8].js`
});

const plugins = [
  // https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new HtmlWebpackPlugin({
    inject: true,
    template: `${APP_PATHS.ABS.SOURCE}/${APP_CONFIG.APP_INDEX_HTML}`
    // favicon: `${APP_PATHS.ABS.SOURCE}/images/favicon.png`
  }),
  new webpack.optimize.UglifyJsPlugin(),
  ...baseWebpackConfig.plugins
];

export default Object.assign({}, baseWebpackConfig, {
  output,
  plugins,
  devtool: false
});
