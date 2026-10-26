const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { createRequire } = require('node:module');
const test = require('node:test');

test('the website renders real SVG without native sound or export warnings', async () => {
  const siteDir = path.resolve(__dirname, '../website');
  const siteRequire = createRequire(path.join(siteDir, 'package.json'));
  const webpack = siteRequire('webpack');
  const plugin = require('../website/src/plugins/rnw.cjs');
  const { mergeStrategy: _mergeStrategy, ...config } = plugin({
    siteDir,
  }).configureWebpack({}, false);
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'unif-svg-web-'));
  const entry = path.join(directory, 'entry.js');
  fs.writeFileSync(
    entry,
    `const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const {default: Svg, Defs, LinearGradient, Stop, Circle} = require('react-native-svg');
module.exports = renderToStaticMarkup(React.createElement(Svg, {width: 100, height: 100},
  React.createElement(Defs, null,
    React.createElement(LinearGradient, {id: 'gradient'},
      React.createElement(Stop, {offset: '0%', stopColor: 'red'}),
      React.createElement(Stop, {offset: '100%', stopColor: 'blue'}))),
  React.createElement(Circle, {cx: 50, cy: 50, r: 40, fill: 'url(#gradient)'})));
`
  );
  const compiler = webpack({
    ...config,
    mode: 'development',
    target: 'web',
    context: siteDir,
    entry,
    cache: false,
    devtool: false,
    optimization: { minimize: false },
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions, '.js', '.jsx', '.json'],
      modules: [
        path.join(siteDir, 'node_modules'),
        path.resolve(__dirname, '../node_modules'),
        'node_modules',
      ],
    },
    output: {
      path: directory,
      filename: 'bundle.cjs',
      library: { type: 'commonjs2' },
    },
  });
  try {
    const stats = await new Promise((resolve, reject) => {
      compiler.run((error, result) =>
        error ? reject(error) : resolve(result)
      );
    });
    const diagnostics = stats.toJson({
      all: false,
      errors: true,
      warnings: true,
    });
    assert.deepEqual(diagnostics.errors, []);
    assert.deepEqual(diagnostics.warnings, []);
    const resources = [...stats.compilation.modules].map(
      (module) => module.resource || ''
    );
    assert(resources.some((file) => file.endsWith('/elements.web.js')));
    assert(
      !resources.some((file) => file.includes('/fabric/NativeSvgSoundModule'))
    );
    const markup = execFileSync(
      process.execPath,
      [
        '-e',
        'process.stdout.write(require(process.argv[1])); process.exit(0);',
        path.join(directory, 'bundle.cjs'),
      ],
      { encoding: 'utf8', timeout: 15000 }
    );
    assert.match(markup, /<svg\b/);
    assert.match(markup, /<defs\b/);
    assert.match(markup, /<linearGradient\b/);
    assert.match(markup, /<circle[^>]*fill="url\(#gradient\)"/);
  } finally {
    await new Promise((resolve, reject) => {
      compiler.close((error) => (error ? reject(error) : resolve()));
    });
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
