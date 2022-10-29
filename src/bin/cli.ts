// Run with yarn dlx coconfig or npx coconfig
import assert from 'assert';
import minimist from 'minimist';
import readPkgUp from 'read-pkg-up';
import runCoConfig from '../index';
import { resolveConfig } from '../resolver';
import type { CoConfigEnvironment } from '../types/index';

const argv = minimist(process.argv.slice(2), {
  default: { gitignore: true, 'modify-git-ignore': true },
  boolean: ['normalize', 'gitignore', 'modify-git-ignore'],
});

async function run() {
  const pkgInfo = readPkgUp.sync({ cwd: argv.cwd, normalize: argv.normalize });
  assert(pkgInfo, 'Cannot find package.json. Pass cwd option that points to a directory with a package.json');
  const { packageJson, path } = pkgInfo;
  const [coconfigPath, coconfig] = await resolveConfig(path, packageJson.config?.coconfig);

  const coconfigEnv: CoConfigEnvironment = {
    packageJson,
    packagePath: path,
    coconfigPath,
    verifyGitIgnore: argv.gitignore,
    modifyGitIgnore: argv['modify-git-ignore'],
  };

  let finalConfig = coconfig;
  if (typeof coconfig === 'function') {
    finalConfig = await coconfig(coconfigEnv);
  }
  await runCoConfig(coconfigEnv, finalConfig);
}

run();
