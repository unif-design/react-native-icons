const fs = require('node:fs');
const path = require('node:path');
const { main } = require('./build-icons.cjs');

async function checkTargets({
  projectRoot = path.resolve(__dirname, '..'),
  harmonyRoot = path.resolve(projectRoot, '../harmony-icons'),
} = {}) {
  for (const file of [
    'library/Index.ets',
    'library/src/main/resources/rawfile/icon-provenance.json',
  ]) {
    if (!fs.existsSync(path.join(harmonyRoot, file))) {
      throw new Error(
        `Harmony target is missing ${file}: ${harmonyRoot}. Provide --harmony-root <checkout>; synchronization has not been verified.`
      );
    }
  }
  await main({ projectRoot, check: true });
  await main({
    projectRoot,
    target: 'harmony',
    outputRoot: harmonyRoot,
    check: true,
  });
}

module.exports = { checkTargets };
if (require.main === module) {
  const args = process.argv.slice(2);
  if (
    args.length !== 0 &&
    (args.length !== 2 || args[0] !== '--harmony-root')
  ) {
    console.error(
      'Usage: node scripts/check-icon-targets.cjs [--harmony-root <checkout>]'
    );
    process.exitCode = 1;
  } else {
    checkTargets({
      harmonyRoot: args.length === 2 ? path.resolve(args[1]) : undefined,
    })
      .then(() =>
        console.log('RN and Harmony icon outputs verified; no files changed.')
      )
      .catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
      });
  }
}
