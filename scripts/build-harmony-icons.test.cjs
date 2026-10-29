const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { main, buildOutputs } = require('./build-icons.cjs');
const root = path.resolve(__dirname, '..');
const dataFile = 'library/src/main/ets/generated/UnifIconData.ets';
const metadataFile = 'library/src/main/resources/rawfile/icon-provenance.json';
const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
function loadData(directory) {
  const exports = {};
  const code = ts.transpileModule(
    fs.readFileSync(path.join(directory, dataFile), 'utf8'),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }
  ).outputText;
  vm.runInNewContext(code, { exports });
  return exports;
}
function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'harmony-icons-'));
  const source = path.join(directory, 'source');
  const target = path.join(directory, 'target');
  fs.mkdirSync(path.join(source, 'src/svg'), { recursive: true });
  fs.mkdirSync(path.join(source, 'scripts'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return { source, target };
}
function writeSources(source, entries) {
  fs.writeFileSync(
    path.join(source, 'scripts/icon-manifest.json'),
    JSON.stringify(
      Object.fromEntries(entries.map((e) => [e.name, e.component]))
    )
  );
  for (const e of entries)
    fs.writeFileSync(path.join(source, 'src/svg', `${e.name}.svg`), e.svg);
}
function generate(source, target, check = false) {
  return main({
    projectRoot: source,
    target: 'harmony',
    outputRoot: target,
    check,
  });
}
function snapshot(directory) {
  return fs
    .readdirSync(directory, { recursive: true })
    .filter((file) => fs.statSync(path.join(directory, file)).isFile())
    .sort()
    .map((file) => [file, fs.readFileSync(path.join(directory, file), 'utf8')]);
}

test('full manifest produces matching named public components, enum and packaged provenance', async (t) => {
  const { target } = fixture(t);
  await generate(root, target);
  assert(
    fs.existsSync(path.join(target, 'library/Index.ets')),
    'Harmony target must emit its public HAR entry'
  );
  const { UnifIconName, getUnifIconDefinition } = loadData(target);
  const names = Object.values(
    JSON.parse(fs.readFileSync(path.join(root, 'scripts/icon-manifest.json')))
  ).sort();
  assert(names.length > 0);
  assert.equal(new Set(names).size, names.length);
  assert.deepEqual(Object.keys(UnifIconName).sort(), names);
  const barrel = fs.readFileSync(
    path.join(target, 'library/Index.ets'),
    'utf8'
  );
  for (const name of names) {
    assert(barrel.includes(`export { ${name} }`), name);
    assert(getUnifIconDefinition(UnifIconName[name]).elements.length > 0, name);
  }
  const provenance = JSON.parse(
    fs.readFileSync(path.join(target, metadataFile))
  );
  assert.equal(provenance.icons.length, names.length);
  assert.match(provenance.sourceRevision, /^[a-f0-9]{40}$/);
  assert.match(provenance.manifestSha256, /^[a-f0-9]{64}$/);
  assert(
    provenance.icons.every((icon) => /^[a-f0-9]{64}$/.test(icon.svgSha256))
  );
  assert(!JSON.stringify(snapshot(target)).includes(root));
});

test('path, rounded rect, circle, fill, no stroke and opacity retain their SVG meaning', async (t) => {
  const { source, target } = fixture(t);
  writeSources(source, [
    {
      name: 'sample',
      component: 'SampleOutlined',
      svg: svg(
        '<path d="M2 3L5 8"/><rect x="8" y="8" width="8" height="6" rx="9" fill="currentColor" stroke="none" opacity="0.55"/><circle cx="12" cy="12" r="9"/>'
      ),
    },
  ]);
  await generate(source, target);
  const { UnifIconName, getUnifIconDefinition } = loadData(target);
  const definition = getUnifIconDefinition(UnifIconName.SampleOutlined);
  assert.equal(definition.strokeWidth, 1.75);
  assert.equal(definition.elements[0].commands, 'M2 3L5 8');
  assert.equal(definition.elements[0].hasFill, false);
  assert.equal(definition.elements[0].hasStroke, true);
  assert.equal(
    definition.elements[1].commands,
    'M12 8 H12 A4 3 0 0 1 16 11 V11 A4 3 0 0 1 12 14 H12 A4 3 0 0 1 8 11 V11 A4 3 0 0 1 12 8 Z'
  );
  assert.equal(definition.elements[1].hasFill, true);
  assert.equal(definition.elements[1].hasStroke, false);
  assert.equal(definition.elements[1].alpha, 0.55);
  assert.equal(
    definition.elements[2].commands,
    'M3 12 A9 9 0 1 0 21 12 A9 9 0 1 0 3 12 Z'
  );
  assert.throws(() => getUnifIconDefinition('MissingOutlined'), /Unknown icon/);
});

test('check detects drift without writes, regeneration is stable, invalid input cannot partially write', async (t) => {
  const { source, target } = fixture(t);
  const entries = [
    { name: 'first', component: 'FirstOutlined', svg: svg('<path d="M1 1"/>') },
    {
      name: 'last',
      component: 'LastOutlined',
      svg: svg('<circle cx="12" cy="12" r="4"/>'),
    },
  ];
  writeSources(source, entries);
  await generate(source, target);
  const before = snapshot(target);
  await generate(source, target);
  assert.deepEqual(snapshot(target), before);
  await generate(source, target, true);
  fs.appendFileSync(path.join(target, dataFile), '\n// drift\n');
  await assert.rejects(() => generate(source, target, true), /stale/i);
  await generate(source, target);
  assert.deepEqual(snapshot(target), before);
  entries[0].svg = svg('<path d="M9 9"/>');
  entries[1].svg = svg('<script>bad</script>');
  writeSources(source, entries);
  await assert.rejects(
    () => generate(source, target),
    /last.*script|last:[\s\S]*script/
  );
  assert.deepEqual(snapshot(target), before);
  entries[1].svg = svg('<path d="M1 1"/>');
  entries[1].component = 'FirstOutlined';
  writeSources(source, entries);
  await assert.rejects(() => generate(source, target), /duplicate/i);
  assert.deepEqual(snapshot(target), before);
});

test('renamed generated modules are removed while non-generated files are protected before writes', async (t) => {
  const { source, target } = fixture(t);
  const entries = [
    { name: 'first', component: 'FirstOutlined', svg: svg('<path d="M1 1"/>') },
  ];
  writeSources(source, entries);
  await generate(source, target);
  const staleFile = path.join(
    target,
    'library/src/main/ets/generated/FirstOutlined.ets'
  );
  entries[0].component = 'SecondOutlined';
  writeSources(source, entries);
  await generate(source, target);
  assert(!fs.existsSync(staleFile));
  fs.writeFileSync(staleFile, '// manually owned');
  const before = snapshot(target);
  entries[0].svg = svg('<path d="M2 2"/>');
  writeSources(source, entries);
  await assert.rejects(() => generate(source, target), /non-generated/);
  assert.deepEqual(snapshot(target), before);
});

test('existing RN output bytes stay identical to the checked-in generation', async () => {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(root, 'scripts/icon-manifest.json'))
  );
  const entries = Object.entries(manifest).map(([name, component]) => ({
    name,
    component,
    svg: fs.readFileSync(path.join(root, 'src/svg', `${name}.svg`), 'utf8'),
  }));
  const outputs = await buildOutputs(entries);
  for (const [file, content] of outputs)
    assert.equal(content, fs.readFileSync(path.join(root, file), 'utf8'), file);
});

test('Harmony check ignores unrelated source commits but still checks all content hashes', async (t) => {
  const { source, target } = fixture(t);
  const { execFileSync } = require('node:child_process');
  const git = (...args) =>
    execFileSync('git', args, { cwd: source, stdio: 'pipe' });
  writeSources(source, [
    { name: 'first', component: 'FirstOutlined', svg: svg('<path d="M1 1"/>') },
  ]);
  git('init', '-q');
  git('add', '.');
  git(
    '-c',
    'user.name=Icons Test',
    '-c',
    'user.email=icons-test@example.invalid',
    'commit',
    '-qm',
    '固定图形源'
  );
  await generate(source, target);
  const before = snapshot(target);
  fs.writeFileSync(path.join(source, 'README.md'), '文档变更不修改图形。\n');
  git('add', 'README.md');
  git(
    '-c',
    'user.name=Icons Test',
    '-c',
    'user.email=icons-test@example.invalid',
    'commit',
    '-qm',
    '更新文档'
  );
  await generate(source, target, true);
  assert.deepEqual(snapshot(target), before);
  const metadataPath = path.join(target, metadataFile);
  const metadata = JSON.parse(fs.readFileSync(metadataPath));
  metadata.icons[0].svgSha256 = '0'.repeat(64);
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2) + '\n');
  await assert.rejects(() => generate(source, target, true), /stale/i);
  await generate(source, target);
  const invalid = JSON.parse(fs.readFileSync(metadataPath));
  invalid.sourceRevision = 'not-a-revision';
  fs.writeFileSync(metadataPath, JSON.stringify(invalid, null, 2) + '\n');
  await assert.rejects(() => generate(source, target, true), /stale/i);
});

test('combined check rejects missing target and RN-only regeneration without writing either tree', async (t) => {
  const checker = path.join(__dirname, 'check-icon-targets.cjs');
  assert(
    fs.existsSync(checker),
    'A regular check must verify the actual RN and Harmony trees'
  );
  const { checkTargets } = require(checker);
  const { source, target } = fixture(t);
  const entries = [
    { name: 'first', component: 'FirstOutlined', svg: svg('<path d="M1 1"/>') },
  ];
  writeSources(source, entries);
  await main({ projectRoot: source });
  await assert.rejects(
    () => checkTargets({ projectRoot: source, harmonyRoot: target }),
    /Harmony.*missing/i
  );
  await generate(source, target);
  await checkTargets({ projectRoot: source, harmonyRoot: target });
  entries[0].svg = svg('<path d="M2 2"/>');
  writeSources(source, entries);
  await main({ projectRoot: source });
  const beforeSource = snapshot(source);
  const beforeTarget = snapshot(target);
  await assert.rejects(
    () => checkTargets({ projectRoot: source, harmonyRoot: target }),
    /stale/i
  );
  assert.deepEqual(snapshot(source), beforeSource);
  assert.deepEqual(snapshot(target), beforeTarget);
  await generate(source, target);
  await checkTargets({ projectRoot: source, harmonyRoot: target });
  for (const file of [
    'library/Index.ets',
    'library/src/main/ets/generated/FirstOutlined.ets',
    'example/src/main/ets/generated/IconCatalog.ets',
  ]) {
    const original = fs.readFileSync(path.join(target, file));
    fs.appendFileSync(path.join(target, file), '\n// manual edit\n');
    await assert.rejects(
      () => checkTargets({ projectRoot: source, harmonyRoot: target }),
      /stale/i
    );
    fs.writeFileSync(path.join(target, file), original);
  }
  await checkTargets({ projectRoot: source, harmonyRoot: target });
});
