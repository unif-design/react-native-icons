const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildOutputs, main } = require('./build-icons.cjs');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const entry = (name, component, body) => ({ name, component, svg: svg(body) });

test('generates isolated modules, a typed named barrel and a separate consumer catalog', async () => {
  const outputs = await buildOutputs([
    entry('send', 'SendOutlined', '<path d="M12 19V5"></path>'),
    entry(
      'star-filled',
      'StarFilled',
      '<path d="M1 1L2 2Z" fill="currentColor" stroke="none"></path>'
    ),
  ]);
  assert(outputs.has('src/icons/SendOutlined.tsx'));
  assert.match(outputs.get('src/icons/SendOutlined.tsx'), /M12 19V5/);
  assert.doesNotMatch(
    outputs.get('src/icons/SendOutlined.tsx'),
    /StarFilled|registry|catalog/
  );
  assert.match(outputs.get('src/icons/StarFilled.tsx'), /stroke: 'none'/);
  assert.match(outputs.get('src/index.tsx'), /default as SendOutlined/);
  assert.doesNotMatch(outputs.get('src/index.tsx'), /ICONS|catalog/);
  assert.match(
    outputs.get('example/src/catalog.ts'),
    /from '@unif\/react-native-icons'/
  );
});

test('rejects duplicate names, invalid identifiers and misleading style suffixes', async () => {
  const outline = entry('send', 'SendOutlined', '<path d="M1 1"></path>');
  await assert.rejects(() => buildOutputs([outline, outline]), /duplicate/i);
  await assert.rejects(
    () => buildOutputs([{ ...outline, component: 'SendIcon' }]),
    /name/i
  );
  await assert.rejects(
    () => buildOutputs([{ ...outline, component: 'SendFilled' }]),
    /style/i
  );
});

test('invalid SVG rejects the entire output generation', async () => {
  await assert.rejects(
    () =>
      buildOutputs([
        entry('send', 'SendOutlined', '<path d="M1 1"></path>'),
        entry('bad', 'BadOutlined', '<script>alert(1)</script>'),
      ]),
    /bad|script/i
  );
});

test('identical sources produce identical outputs regardless of enumeration order', async () => {
  const a = entry('send', 'SendOutlined', '<path d="M1 1"></path>');
  const b = entry(
    'camera',
    'CameraOutlined',
    '<circle cx="12" cy="12" r="4"></circle>'
  );
  assert.deepEqual(await buildOutputs([a, b]), await buildOutputs([b, a]));
});

test('check is read-only, invalid input preserves output, and renamed generated modules are removed', async () => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'unif-icons-generator-')
  );
  try {
    fs.mkdirSync(path.join(directory, 'src/svg'), { recursive: true });
    fs.mkdirSync(path.join(directory, 'scripts'));
    const source = path.join(directory, 'src/svg/send.svg');
    const manifest = path.join(directory, 'scripts/icon-manifest.json');
    fs.writeFileSync(source, svg('<path d="M1 1"></path>'));
    fs.writeFileSync(manifest, JSON.stringify({ send: 'SendOutlined' }));
    await main({ projectRoot: directory });
    const generated = path.join(directory, 'src/icons/SendOutlined.tsx');
    const before = fs.readFileSync(generated, 'utf8');
    await main({ projectRoot: directory, check: true });
    fs.writeFileSync(source, svg('<path d="M2 2"></path>'));
    await assert.rejects(
      () => main({ projectRoot: directory, check: true }),
      /stale/i
    );
    assert.equal(fs.readFileSync(generated, 'utf8'), before);
    fs.writeFileSync(source, svg('<script>bad()</script>'));
    await assert.rejects(() => main({ projectRoot: directory }), /script/i);
    assert.equal(fs.readFileSync(generated, 'utf8'), before);
    fs.writeFileSync(source, svg('<path d="M2 2"></path>'));
    fs.writeFileSync(manifest, JSON.stringify({ send: 'NewSendOutlined' }));
    await main({ projectRoot: directory });
    assert(!fs.existsSync(generated));
    assert(
      fs.existsSync(path.join(directory, 'src/icons/NewSendOutlined.tsx'))
    );
    fs.writeFileSync(manifest, '{}');
    await assert.rejects(
      () => main({ projectRoot: directory }),
      /exactly the same names/
    );
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
