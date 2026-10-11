const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createRequire } = require('node:module');
const { execFileSync } = require('node:child_process');
const ts = require('typescript');
const babel = require('@babel/core');

const root = path.resolve(__dirname, '..');
const temporary = fs.realpathSync(
  fs.mkdtempSync(path.join(os.tmpdir(), 'unif-icons-packed-'))
);
try {
  const packResult = JSON.parse(
    execFileSync(
      'npm',
      ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary],
      {
        cwd: root,
        encoding: 'utf8',
        env: {
          ...process.env,
          npm_config_cache: path.join(temporary, 'npm-cache'),
        },
      }
    )
  );
  // npm 12 keys JSON output by package name; earlier versions return an array.
  const packed = Array.isArray(packResult)
    ? packResult[0]
    : packResult['@unif/react-native-icons'];
  assert(
    packed?.filename && Array.isArray(packed.files),
    'Invalid npm pack output'
  );
  assert(
    !packed.files.some(({ path: file }) =>
      /\.svg$|\/multiply\.|^(scripts|example|website|__tests__)\//.test(file)
    ),
    'package must not ship generator, SVG sources or development consumers'
  );
  const installed = path.join(
    temporary,
    'node_modules/@unif/react-native-icons'
  );
  fs.mkdirSync(installed, { recursive: true });
  execFileSync('tar', [
    '-xzf',
    path.join(temporary, packed.filename),
    '--strip-components=1',
    '-C',
    installed,
  ]);
  // Reuse installed peer runtimes; the library under test comes only from the tarball.
  for (const name of [
    'react',
    'react-native',
    'react-native-svg',
    '@types/react',
    '@types/node',
  ]) {
    const destination = path.join(temporary, 'node_modules', name);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.symlinkSync(path.join(root, 'node_modules', name), destination, 'dir');
  }
  const requireFromConsumer = createRequire(
    path.join(temporary, 'package.json')
  );
  const entry = requireFromConsumer.resolve(
    '@unif/react-native-icons/SendOutlined'
  );
  assert.equal(entry, path.join(installed, 'lib/module/icons/SendOutlined.js'));
  const seen = new Set();
  function visit(file) {
    if (seen.has(file)) return;
    seen.add(file);
    const ast = babel.parseSync(fs.readFileSync(file, 'utf8'), {
      configFile: false,
      babelrc: false,
      sourceType: 'module',
    });
    for (const node of ast.program.body) {
      if (node.source?.value?.startsWith('.'))
        visit(path.resolve(path.dirname(file), node.source.value));
    }
  }
  visit(entry);
  assert.equal(
    [...seen].filter((file) => file.includes('/icons/')).length,
    1,
    'direct import must not load another icon'
  );
  const smoke = path.join(temporary, 'consumer.tsx');
  fs.writeFileSync(
    smoke,
    `
import { createRef, type ComponentRef } from 'react';
import { SendOutlined, StarFilled, type IconProps } from '@unif/react-native-icons';
import Send from '@unif/react-native-icons/SendOutlined';
const props: IconProps = {size: 20, color: '#123', accessible: true, accessibilityLabel: 'Send'};
const ref = createRef<ComponentRef<typeof Send>>();
export const icons = <><SendOutlined {...props} /><StarFilled /><Send ref={ref} /></>;
// @ts-expect-error size is numeric
export const badSize = <Send size="24" />;
// @ts-expect-error geometry is owned by the icon
export const badGeometry = <Send viewBox="0 0 1 1" />;
// @ts-expect-error Icon aliases are not part of the public contract
import { SendIcon } from '@unif/react-native-icons';
// @ts-expect-error internal renderer has no public export
import { createIcon } from '@unif/react-native-icons/createIcon';
`
  );
  const program = ts.createProgram([smoke], {
    noEmit: true,
    strict: true,
    skipLibCheck: true,
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ESNext,
    esModuleInterop: true,
  });
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(
    diagnostics.length,
    0,
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCurrentDirectory: () => temporary,
      getCanonicalFileName: (file) => file,
      getNewLine: () => '\n',
    })
  );
  assert.equal(
    Object.keys(require(path.join(installed, 'package.json')).peerDependencies)
      .length,
    3
  );
  console.log(
    `package: ${packed.files.length} files, compiled subpath + public types verified; single-icon library graph: ${seen.size} modules`
  );
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
