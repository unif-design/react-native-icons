const path = require('node:path');

module.exports = function rnw(context) {
  const library = path.resolve(context.siteDir, '../src');
  return {
    name: 'unif-icons-rnw',
    configureWebpack() {
      return {
        mergeStrategy: { 'resolve.extensions': 'prepend' },
        resolve: {
          alias: {
            'react-native$': require.resolve('react-native-web'),
            '@unif/react-native-icons$': path.join(library, 'index.tsx'),
            // A workspace library must share the website's React runtime.
            'react': path.dirname(require.resolve('react/package.json')),
            'react-native-svg': path.dirname(
              require.resolve('react-native-svg/package.json')
            ),
          },
          extensions: ['.web.js', '.web.ts', '.web.tsx', '.ts', '.tsx'],
        },
        module: {
          rules: [
            {
              // The RN compatibility registry mixes an ES import with CommonJS exports.
              test: /\.js$/,
              include: path.dirname(
                require.resolve('@react-native/assets-registry/registry')
              ),
              use: {
                loader: require.resolve('babel-loader'),
                options: {
                  babelrc: false,
                  configFile: false,
                  plugins: [
                    require.resolve('@babel/plugin-transform-modules-commonjs'),
                  ],
                },
              },
            },
            {
              test: /\.tsx?$/,
              include: library,
              use: {
                loader: require.resolve('babel-loader'),
                options: {
                  babelrc: false,
                  configFile: false,
                  presets: [
                    [
                      require.resolve('@babel/preset-react'),
                      { runtime: 'automatic' },
                    ],
                    require.resolve('@babel/preset-typescript'),
                  ],
                },
              },
            },
          ],
        },
      };
    },
  };
};
