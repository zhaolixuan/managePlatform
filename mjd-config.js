/* eslint-disable new-cap */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const CopyPlugin = require('copy-webpack-plugin');
const px2rem = require('postcss-px2rem-exclude');
const rewirePostcss = require('react-app-rewire-postcss');
const { dependencies } = require('./package.json');

const env = process.env.REACT_APP_BUILD_ENV || 'development';

console.log('process.env.REACT_APP_BUILD_ENV', process.env.REACT_APP_BUILD_ENV);
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  custom: {
    output: {
      publicPath: 'auto',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        src: path.resolve(__dirname, './src'),
        crypto: false,
      },
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, `./static/config.${env}.js`),
            to: `./${process.env.REACT_APP_CONFIG_PATH}`,
          },
        ],
      }),
      new webpack.EnvironmentPlugin( { ...process.env } ),
      new ModuleFederationPlugin({
        name: 'craTemplateWp5',
        filename: 'remoteEntry.js',
        remotes: {},
        exposes: {
          // './render': './src/lcdp/Render.js'
        },
        shared: [
          {
            react: {
              singleton: true,
              requiredVersion: dependencies.react,
            },
            'react-dom': {
              singleton: true,
              requiredVersion: dependencies['react-dom'],
            },
          },
        ],
      }),
    ],
  },
  override: (config) => {
    const { oneOf } = config.module.rules[0];
    let less = oneOf[oneOf.length - 3].use.slice(-2);
    less[0].options = {
      sourceMap: true,
      relativeUrls: true,
      javascriptEnabled: true,
      modifyVars: {
        hack: `true;@import "${path.resolve(__dirname, 'src/styles/theme/index.less')}";`,
      },
      localIdentName:
        process.env.NODE_ENV === 'production' ? '[local]__[hash:base64:10]' : '[path][name]__[local]__[hash:base64:5]', // ????????? CSS Modules ??? localIdentName
    };
    less = oneOf[oneOf.length - 5].use.slice(-1);
    less[0].options = {
      sourceMap: true,
      relativeUrls: true,
      javascriptEnabled: true,
      modifyVars: {
        hack: `true;@import "${path.resolve(__dirname, 'src/styles/theme/index.less')}";`,
      },
      localIdentName:
        process.env.NODE_ENV === 'production' ? '[local]__[hash:base64:10]' : '[path][name]__[local]__[hash:base64:5]', // ????????? CSS Modules ??? localIdentName
    };

    // ???????????????????????????dist/web ?????????
    // paths.appBuild = path.join(path.dirname(paths.appBuild), 'dist/web');
    // config.output.path = paths.appBuild;
    // if (process.env.REACT_APP_BUILD_ENV !== 'development') {
    // paths.appBuild = path.join(path.dirname(paths.appBuild), 'dist/web');
    // config.output.path = paths.appBuild;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const paths = require('react-scripts/config/paths');
    // const pathPublic = `/report-map${process.env.REACT_APP_BUILD_ENV === 'production' ? '' : '-test'}/`;
    // ?????????????????????/web/
    paths.publicUrlOrPath = process.env.REACT_APP_PATH_PUBLIC;
    config.output.publicPath = process.env.REACT_APP_PATH_PUBLIC;
    // }

    // ??????postcss
    rewirePostcss(config, {
      plugins: () => [
        // require('postcss-flexbugs-fixes'),
        // require('postcss-preset-env')({
        //   autoprefixer: {
        //     flexbox: 'no-2009',
        //   },
        //   stage: 3,
        // }),
        // ??????:??????px2rem
        px2rem({
          remUnit: 100, // ????????????????????????75?????????antd??????????????????????????????????????????????????????37.5??????????????????????????????
          // exclude: /node-modules/i,
        }),
      ],
    });

    return config;
  },
};
