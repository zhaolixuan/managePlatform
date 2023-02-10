module.exports = {
  sourceType: 'unambiguous',
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'entry',
        corejs: { version: 3, proposals: true },
        shippedProposals: true,
        targets: { ie: 9 },
      },
    ],
    ['@babel/preset-react'],
  ],
  plugins: [
    ['@babel/plugin-syntax-dynamic-import'],
    ['@babel/plugin-syntax-class-properties'],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: { version: 3, proposals: true },
      },
    ],
    '@babel/plugin-proposal-private-methods',
    '@babel/plugin-proposal-private-property-in-object',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-class-properties',
    'transform-es2015-shorthand-properties',
    'lodash',
    ['import', { libraryName: 'antd', style: true }, 'antd'],
    ['import', { libraryName: '@jd/find-react', style: true }, '@jd/find-react'],
    [
      'transform-imports',
      {
        'uc-fun': {
          // eslint-disable-next-line
          transform: "uc-fun/src/${member}",
          preventFullImport: true,
        },
      },
    ],
  ],
};
